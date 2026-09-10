import os
import sys
import time
import argparse
import numpy as np

# Ensure inference-bridge is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "inference-bridge")))

from inference_backend import CpuBackend
from tensor_bridge import preprocess_frame


def benchmark_cpu_proxy(
    model_path: str = "ml/weights/yolov8n_picker.onnx",
    iterations: int = 20,
    warmup: int = 5
):
    """
    Runs local CPU-side proxy benchmarking for the exported YOLOv8 ONNX model.
    
    NOTE: Latency measured here represents CPU execution and is a proxy benchmark.
    Real NPU inference latency target (<10.7ms HTP / sub-50ms end-to-end) requires 
    physical Snapdragon 8 Gen 1 hardware testing in Stage 4.
    """
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"ONNX model file not found at: {model_path}")

    print(f"\n=======================================================")
    print(f"  SnapAR Picker — ML Pipeline Local CPU Proxy Benchmark")
    print(f"=======================================================")
    print(f"Model Path: {os.path.abspath(model_path)}")
    print(f"Targeting:  CpuBackend (ONNX Runtime CPUExecutionProvider)")

    backend = CpuBackend()
    backend.load_model(model_path)

    # Generate synthetic camera frame (1080p RGBA)
    dummy_frame = np.random.randint(0, 255, (1080, 1920, 4), dtype=np.uint8)
    input_tensor = preprocess_frame(dummy_frame, target_size=(640, 640), is_rgba=True)

    print(f"\nWarming up ({warmup} iterations)...")
    for _ in range(warmup):
        backend.run_inference(input_tensor)

    print(f"Benchmarking ({iterations} iterations)...")
    latencies = []
    for i in range(iterations):
        _, latency = backend.run_inference(input_tensor)
        latencies.append(latency)

    avg_latency = np.mean(latencies)
    min_latency = np.min(latencies)
    max_latency = np.max(latencies)
    p95_latency = np.percentile(latencies, 95)

    print(f"\n-------------------------------------------------------")
    print(f"  CPU PROXY BENCHMARK RESULTS (NOT REAL NPU NUMBERS)")
    print(f"-------------------------------------------------------")
    print(f"  Average Latency: {avg_latency:.2f} ms")
    print(f"  Min Latency:     {min_latency:.2f} ms")
    print(f"  Max Latency:     {max_latency:.2f} ms")
    print(f"  P95 Latency:     {p95_latency:.2f} ms")
    print(f"  Output Provider: {backend.get_active_provider()}")
    print(f"=======================================================\n")

    return {
        "avg_ms": avg_latency,
        "min_ms": min_latency,
        "max_ms": max_latency,
        "p95_ms": p95_latency,
        "provider": backend.get_active_provider()
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Benchmark YOLOv8 ONNX model on CPU")
    parser.add_argument("--model", type=str, default="ml/weights/yolov8n_picker.onnx", help="Path to .onnx model")
    parser.add_argument("--iters", type=int, default=20, help="Benchmark iterations")
    args = parser.parse_args()

    benchmark_cpu_proxy(model_path=args.model, iterations=args.iters)
