import os
import sys
import pytest
import numpy as np
import onnx
from onnx import helper, TensorProto
from unittest.mock import MagicMock, patch

# Ensure inference-bridge is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "inference-bridge")))

from inference_backend import CpuBackend, QnnBackend, create_inference_backend
from tensor_bridge import preprocess_frame


@pytest.fixture(scope="module")
def sample_onnx_model(tmp_path_factory):
    """Creates a minimal valid ONNX model file using onnx.helper (Identity operator, Opset 17)."""
    model_dir = tmp_path_factory.mktemp("models")
    onnx_path = str(model_dir / "synthetic_yolov8.onnx")

    input_tensor = helper.make_tensor_value_info("images", TensorProto.FLOAT, [1, 3, 640, 640])
    output_tensor = helper.make_tensor_value_info("output0", TensorProto.FLOAT, [1, 3, 640, 640])

    identity_node = helper.make_node(
        "Identity",
        inputs=["images"],
        outputs=["output0"]
    )

    graph = helper.make_graph(
        [identity_node],
        "yolov8_test_graph",
        [input_tensor],
        [output_tensor]
    )

    opset_id = helper.make_opsetid("", 17)
    model = helper.make_model(graph, producer_name="snap_ar_test", opset_imports=[opset_id])
    onnx.save(model, onnx_path)
    return onnx_path


def test_cpu_backend_real_inference(sample_onnx_model):
    backend = CpuBackend()
    backend.load_model(sample_onnx_model)

    assert backend.get_active_provider() == "CPUExecutionProvider"

    # Preprocess a dummy RGBA frame
    raw_frame = np.random.randint(0, 255, (1080, 1920, 4), dtype=np.uint8)
    tensor = preprocess_frame(raw_frame, target_size=(640, 640), is_rgba=True)

    assert tensor.shape == (1, 3, 640, 640)
    assert tensor.dtype == np.float32

    output, latency_ms = backend.run_inference(tensor)

    assert isinstance(output, np.ndarray)
    assert output.shape == (1, 3, 640, 640)
    assert latency_ms > 0.0
    print(f"\n[Test Evidence] CpuBackend Real Inference Latency: {latency_ms:.2f} ms")


def test_qnn_backend_mocked_execution(sample_onnx_model):
    with patch("onnxruntime.InferenceSession") as mock_session_cls:
        mock_session_instance = MagicMock()
        mock_session_instance.get_providers.return_value = ["QNNExecutionProvider", "CPUExecutionProvider"]
        mock_input = MagicMock()
        mock_input.name = "images"
        mock_session_instance.get_inputs.return_value = [mock_input]
        mock_session_instance.run.return_value = [np.zeros((1, 3, 640, 640), dtype=np.float32)]
        mock_session_cls.return_value = mock_session_instance

        backend = QnnBackend(context_binary_path="/dummy/path/qnn_context.bin")
        backend.load_model(sample_onnx_model)

        assert backend.get_active_provider() == "QNNExecutionProvider"

        dummy_tensor = np.zeros((1, 3, 640, 640), dtype=np.float32)
        output, latency_ms = backend.run_inference(dummy_tensor)

        assert output.shape == (1, 3, 640, 640)
        assert latency_ms >= 0.0
        print(f"\n[Test Evidence] QnnBackend Mocked Execution Success. EP: {backend.get_active_provider()}")


def test_invalid_model_path_raises_error():
    backend = CpuBackend()
    with pytest.raises(FileNotFoundError, match="Model file not found"):
        backend.load_model("non_existent_model.onnx")


def test_malformed_tensor_raises_error(sample_onnx_model):
    backend = CpuBackend()
    backend.load_model(sample_onnx_model)
    with pytest.raises(ValueError, match="Input tensor must be a numpy ndarray"):
        backend.run_inference("invalid_string_input")


def test_unloaded_session_raises_error():
    backend = CpuBackend()
    dummy_tensor = np.zeros((1, 3, 640, 640), dtype=np.float32)
    with pytest.raises(RuntimeError, match="Model session is not loaded"):
        backend.run_inference(dummy_tensor)


def test_backend_factory():
    cpu_backend = create_inference_backend("cpu")
    assert isinstance(cpu_backend, CpuBackend)

    qnn_backend = create_inference_backend("qnn")
    assert isinstance(qnn_backend, QnnBackend)

    with pytest.raises(ValueError, match="Unsupported INFERENCE_BACKEND"):
        create_inference_backend("invalid_provider")
