import os
import logging
import time
from abc import ABC, abstractmethod
from typing import Dict, Any, Tuple, Optional
import numpy as np
import onnxruntime as ort

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("InferenceBridge")


class InferenceBackend(ABC):
    """Abstract interface for SnapAR Picker inference backends."""

    @abstractmethod
    def load_model(self, model_path: str) -> None:
        """Loads model file into ONNX Runtime inference session."""
        pass

    @abstractmethod
    def run_inference(self, input_tensor: np.ndarray) -> Tuple[np.ndarray, float]:
        """Runs inference on input tensor. Returns (output_tensor, latency_ms)."""
        pass

    @abstractmethod
    def get_active_provider(self) -> str:
        """Returns the active ONNX Runtime Execution Provider name."""
        pass


class CpuBackend(InferenceBackend):
    """ONNX Runtime CPU Execution Provider implementation for local dev and CI."""

    def __init__(self):
        self.session: Optional[ort.InferenceSession] = None
        self.input_name: Optional[str] = None

    def load_model(self, model_path: str) -> None:
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at path: {model_path}")
        
        logger.info(f"[CpuBackend] Loading ONNX model from '{model_path}' with CPUExecutionProvider...")
        try:
            opts = ort.SessionOptions()
            opts.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
            self.session = ort.InferenceSession(model_path, opts, providers=["CPUExecutionProvider"])
            self.input_name = self.session.get_inputs()[0].name
            
            providers = self.session.get_providers()
            logger.info(f"[CpuBackend] Session successfully initialized. Active providers: {providers}")
        except Exception as e:
            logger.error(f"[CpuBackend] Session initialization failed: {e}")
            raise RuntimeError(f"CpuBackend session init failure: {e}")

    def run_inference(self, input_tensor: np.ndarray) -> Tuple[np.ndarray, float]:
        if self.session is None or self.input_name is None:
            raise RuntimeError("Model session is not loaded. Call load_model() first.")
        
        if not isinstance(input_tensor, np.ndarray):
            raise ValueError(f"Input tensor must be a numpy ndarray, got {type(input_tensor)}")

        active_provider = self.get_active_provider()
        logger.info(f"[CpuBackend] Running inference call using ExecutionProvider: '{active_provider}'")

        start_time = time.perf_counter()
        outputs = self.session.run(None, {self.input_name: input_tensor})
        latency_ms = (time.perf_counter() - start_time) * 1000.0

        logger.info(f"[CpuBackend] Inference complete on {active_provider}. Latency: {latency_ms:.2f} ms")
        return outputs[0], latency_ms

    def get_active_provider(self) -> str:
        if self.session:
            return self.session.get_providers()[0]
        return "CPUExecutionProvider (uninitialized)"


class QnnBackend(InferenceBackend):
    """ONNX Runtime Qualcomm Hexagon NPU (QNN Execution Provider) implementation."""

    def __init__(self, context_binary_path: Optional[str] = None):
        self.session: Optional[ort.InferenceSession] = None
        self.input_name: Optional[str] = None
        self.context_binary_path = context_binary_path

    def load_model(self, model_path: str) -> None:
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at path: {model_path}")

        logger.info(f"[QnnBackend] Configuring QNN Execution Provider targeting Hexagon NPU (HTP)...")

        opts = ort.SessionOptions()
        
        # Configure QNN EP options according to Snapdragon Spaces & QNN specification
        qnn_options = {
            "backend_path": "libQnnHtp.so",
            "htp_performance_mode": "burst",
            "enable_htp_shared_memory_allocator": "1",
        }

        if self.context_binary_path:
            logger.info(f"[QnnBackend] Wiring context binary cache from: {self.context_binary_path}")
            qnn_options["ep.context_enable"] = "1"
            qnn_options["ep.context_file_path"] = self.context_binary_path

        try:
            # QNN execution provider with fallback assertion logging
            self.session = ort.InferenceSession(
                model_path, 
                opts, 
                providers=[("QNNExecutionProvider", qnn_options), "CPUExecutionProvider"]
            )
            self.input_name = self.session.get_inputs()[0].name
            
            providers = self.session.get_providers()
            active_ep = providers[0]
            logger.info(f"[QnnBackend] Session initialized. Active Execution Provider: '{active_ep}'")
            
            if active_ep != "QNNExecutionProvider":
                logger.warning(
                    f"[QnnBackend] CRITICAL ALERT: Silent CPU Fallback detected! "
                    f"Active provider is '{active_ep}' instead of 'QNNExecutionProvider'."
                )
        except Exception as e:
            logger.error(f"[QnnBackend] QNN Session initialization failed: {e}")
            raise RuntimeError(f"QnnBackend session init failure: {e}")

    def run_inference(self, input_tensor: np.ndarray) -> Tuple[np.ndarray, float]:
        if self.session is None or self.input_name is None:
            raise RuntimeError("Model session is not loaded. Call load_model() first.")
        
        if not isinstance(input_tensor, np.ndarray):
            raise ValueError(f"Input tensor must be a numpy ndarray, got {type(input_tensor)}")

        active_provider = self.get_active_provider()
        logger.info(f"[QnnBackend] Running inference call using ExecutionProvider: '{active_provider}'")

        start_time = time.perf_counter()
        outputs = self.session.run(None, {self.input_name: input_tensor})
        latency_ms = (time.perf_counter() - start_time) * 1000.0

        logger.info(f"[QnnBackend] Inference complete on {active_provider}. Latency: {latency_ms:.2f} ms")
        return outputs[0], latency_ms

    def get_active_provider(self) -> str:
        if self.session:
            return self.session.get_providers()[0]
        return "QNNExecutionProvider (uninitialized)"


def create_inference_backend(backend_type: Optional[str] = None, context_binary_path: Optional[str] = None) -> InferenceBackend:
    """Factory function selecting backend via INFERENCE_BACKEND env var or explicit argument."""
    selected = backend_type or os.getenv("INFERENCE_BACKEND", "cpu").lower()
    logger.info(f"[InferenceFactory] Selecting backend '{selected}'")

    if selected == "qnn":
        return QnnBackend(context_binary_path=context_binary_path)
    elif selected == "cpu":
        return CpuBackend()
    else:
        raise ValueError(f"Unsupported INFERENCE_BACKEND: '{selected}'. Supported: ['cpu', 'qnn']")
