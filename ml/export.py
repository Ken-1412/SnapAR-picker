import os
import argparse
from pathlib import Path
from ultralytics import YOLO
import onnxruntime as ort


def export_to_onnx(
    weights_path: str = "ml/runs/train_smoke/weights/best.pt",
    output_onnx_path: str = "ml/weights/yolov8n_picker.onnx",
    img_size: int = 640
) -> str:
    """
    Exports PyTorch YOLOv8 weights to ONNX format and validates loading via ONNX Runtime.
    """
    if not os.path.exists(weights_path):
        # Fallback to last.pt if best.pt does not exist
        alt_weights = Path(weights_path).parent / "last.pt"
        if alt_weights.exists():
            weights_path = str(alt_weights)
        else:
            raise FileNotFoundError(f"Weights file not found at: {weights_path}")

    print(f"[MLExport] Loading PyTorch model from '{weights_path}'...")
    model = YOLO(weights_path)

    out_dir = Path(output_onnx_path).parent
    out_dir.mkdir(parents=True, exist_ok=True)

    print(f"[MLExport] Exporting PyTorch model to ONNX format (opset 17, imgsz {img_size})...")
    exported_file = model.export(
        format="onnx",
        imgsz=img_size,
        opset=17,
        dynamic=False,
        simplify=True
    )

    # Move exported ONNX model to designated output path if different
    exported_path = Path(exported_file)
    target_path = Path(output_onnx_path)
    if exported_path.resolve() != target_path.resolve():
        if target_path.exists():
            target_path.unlink()
        exported_path.rename(target_path)

    print(f"[MLExport] ONNX model exported to: {target_path.resolve()}")

    # Validate exported ONNX model with ONNX Runtime
    print(f"[MLExport] Validating exported ONNX model with ONNX Runtime...")
    try:
        session = ort.InferenceSession(str(target_path.resolve()), providers=["CPUExecutionProvider"])
        inputs = session.get_inputs()
        outputs = session.get_outputs()
        print(f"[MLExport] ONNX Validation Success!")
        print(f"  Inputs:  {[{i.name: i.shape} for i in inputs]}")
        print(f"  Outputs: {[{o.name: o.shape} for o in outputs]}")
    except Exception as e:
        raise RuntimeError(f"Exported ONNX validation failed: {e}")

    return str(target_path.resolve())


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Export YOLOv8 model to ONNX")
    parser.add_argument("--weights", type=str, default="ml/runs/train_smoke/weights/best.pt", help="Path to .pt weights")
    parser.add_argument("--output", type=str, default="ml/weights/yolov8n_picker.onnx", help="Output .onnx path")
    args = parser.parse_args()

    export_to_onnx(weights_path=args.weights, output_onnx_path=args.output)
