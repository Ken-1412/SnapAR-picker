import os
import argparse
from pathlib import Path
from ultralytics import YOLO


def train_yolo(
    data_yaml: str = "ml/dataset/smoke_test/data.yaml",
    model_name: str = "yolov8n.pt",
    epochs: int = 1,
    img_size: int = 640,
    batch_size: int = 4,
    project_dir: str = "ml/runs"
):
    """
    Fine-tunes YOLOv8-nano model on specified dataset.
    
    Args:
        data_yaml: Path to dataset data.yaml file.
        model_name: Base pretrained model checkpoint (default 'yolov8n.pt').
        epochs: Number of training epochs (default 1 for smoke test).
        img_size: Input image resolution (default 640).
        batch_size: Batch size (default 4).
        project_dir: Output directory for weights and training logs.
    """
    if not os.path.exists(data_yaml):
        raise FileNotFoundError(f"Dataset config data.yaml not found at: {data_yaml}")

    print(f"[ML Train] Loading pretrained base model: {model_name}...")
    model = YOLO(model_name)

    print(f"[ML Train] Starting fine-tuning (Epochs: {epochs}, Batch Size: {batch_size}, ImgSize: {img_size})...")
    results = model.train(
        data=data_yaml,
        epochs=epochs,
        imgsz=img_size,
        batch=batch_size,
        project=project_dir,
        name="train_smoke",
        exist_ok=True,
        verbose=True,
        workers=0 # Single process worker for local Windows compatibility
    )

    weights_dir = Path(project_dir) / "train_smoke" / "weights"
    best_weights = weights_dir / "best.pt"
    last_weights = weights_dir / "last.pt"

    output_path = best_weights if best_weights.exists() else last_weights
    print(f"[ML Train] Training complete. Fine-tuned weights saved to: {output_path.resolve()}")
    return str(output_path.resolve())


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Fine-tune YOLOv8 model for SnapAR Picker")
    parser.add_argument("--data", type=str, default="ml/dataset/smoke_test/data.yaml", help="Path to data.yaml")
    parser.add_argument("--epochs", type=int, default=1, help="Number of training epochs")
    parser.add_argument("--batch", type=int, default=4, help="Batch size")
    args = parser.parse_args()

    train_yolo(data_yaml=args.data, epochs=args.epochs, batch_size=args.batch)
