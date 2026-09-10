import os
import sys
import argparse
import qai_hub as hub


def quantize_and_compile_qnn(
    onnx_model_path: str = "ml/weights/yolov8n_picker.onnx",
    output_bin_path: str = "ml/weights/yolov8n_picker_w8a16_context.bin",
    target_device_name: str = "Snapdragon 8 Gen 1"
):
    """
    Submits ONNX model to Qualcomm AI Hub (qai-hub) for W8A16 static quantization
    and compiles a QNN context binary targeting Hexagon HTP (Architecture 69).
    
    Requires QAI_HUB_API_TOKEN environment variable.
    """
    api_token = os.getenv("QAI_HUB_API_TOKEN")
    if not api_token or api_token == "your_qualcomm_ai_hub_api_token_here":
        print("\n[QAI Hub Quantize] ERROR: QAI_HUB_API_TOKEN environment variable is missing or unconfigured.")
        print("  Status: Blocked — Needs Human + Qualcomm AI Hub Token.")
        print("  Please set your API token in .env or environment: export QAI_HUB_API_TOKEN='<your_token>'\n")
        return False

    if not os.path.exists(onnx_model_path):
        raise FileNotFoundError(f"Input ONNX model not found at: {onnx_model_path}")

    print(f"[QAI Hub Quantize] Authenticating with Qualcomm AI Hub...")
    hub.set_api_token(api_token)

    print(f"[QAI Hub Quantize] Submitting '{onnx_model_path}' for compilation on target device '{target_device_name}'...")
    try:
        # Select device architecture (Snapdragon 8 Gen 1 HTP / Arch 69)
        devices = hub.get_devices(target_device_name)
        if not devices:
            raise RuntimeError(f"Target device '{target_device_name}' not available on Qualcomm AI Hub.")

        target_device = devices[0]
        print(f"[QAI Hub Quantize] Selected Target Silicon: {target_device.name} (OS: {target_device.os})")

        # Upload ONNX model
        model = hub.upload_model(onnx_model_path)

        # Submit compilation job with W8A16 quantization options targeting QNN HTP
        compile_job = hub.submit_compile_job(
            model=model,
            device=target_device,
            options="--target_runtime qnn_lib --quantize_w8a16"
        )

        print(f"[QAI Hub Quantize] Waiting for QNN context binary compilation job {compile_job.job_id}...")
        target_model = compile_job.get_target_model()

        # Download compiled QNN context binary (.bin)
        os.makedirs(os.path.dirname(output_bin_path), exist_ok=True)
        target_model.download(output_bin_path)

        print(f"[QAI Hub Quantize] SUCCESS! Compiled QNN context binary saved to: {os.path.abspath(output_bin_path)}")
        return True

    except Exception as e:
        print(f"[QAI Hub Quantize] Compilation job failed: {e}")
        return False


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Apply W8A16 quantization and compile QNN context binary via QAI Hub")
    parser.add_argument("--onnx", type=str, default="ml/weights/yolov8n_picker.onnx", help="Input ONNX model path")
    parser.add_argument("--output", type=str, default="ml/weights/yolov8n_picker_w8a16_context.bin", help="Output .bin context path")
    args = parser.parse_args()

    quantize_and_compile_qnn(onnx_model_path=args.onnx, output_bin_path=args.output)
