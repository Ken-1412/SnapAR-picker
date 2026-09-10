import os
import cv2
import yaml
import numpy as np
from pathlib import Path


def generate_placeholder_dataset(output_dir: str = "ml/dataset/smoke_test"):
    """
    Generates a synthetic placeholder dataset (synthetic box images + YOLO labels)
    purely to prove that the ML training, export, quantization, and inference pipeline works end-to-end.
    
    NOTE: This is a PIPELINE SMOKE TEST, not a real warehouse accuracy benchmark.
    """
    base_path = Path(output_dir)
    train_img_dir = base_path / "images" / "train"
    train_lbl_dir = base_path / "labels" / "train"
    val_img_dir = base_path / "images" / "val"
    val_lbl_dir = base_path / "labels" / "val"

    for d in [train_img_dir, train_lbl_dir, val_img_dir, val_lbl_dir]:
        d.mkdir(parents=True, exist_ok=True)

    def create_synthetic_sample(file_idx: int, is_train: bool):
        img_dir = train_img_dir if is_train else val_img_dir
        lbl_dir = train_lbl_dir if is_train else val_lbl_dir

        # Create 640x640 synthetic image with a colored rectangle representing a SKU box
        img = np.full((640, 640, 3), 200, dtype=np.uint8)
        
        # Add background shelf lines
        cv2.line(img, (0, 400), (640, 400), (100, 100, 100), 5)
        
        # Bounding box coordinates (x_min, y_min, x_max, y_max)
        x_min, y_min = 150 + (file_idx * 10), 200
        x_max, y_max = 450 + (file_idx * 10), 380

        # Draw box
        cv2.rectangle(img, (x_min, y_min), (x_max, y_max), (50, 150, 250), -1)
        cv2.putText(img, f"SKU-{file_idx}", (x_min + 10, y_min + 40), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 255, 255), 2)

        # Save image
        img_filename = f"smoke_sample_{file_idx:03d}.jpg"
        cv2.imwrite(str(img_dir / img_filename), img)

        # Calculate normalized YOLO format label: <class_id> <x_center> <y_center> <width> <height>
        dw = 1.0 / 640.0
        dh = 1.0 / 640.0
        x_center = ((x_min + x_max) / 2.0) * dw
        y_center = ((y_min + y_max) / 2.0) * dh
        w = (x_max - x_min) * dw
        h = (y_max - y_min) * dh

        lbl_filename = f"smoke_sample_{file_idx:03d}.txt"
        with open(lbl_dir / lbl_filename, "w") as f:
            f.write(f"0 {x_center:.6f} {y_center:.6f} {w:.6f} {h:.6f}\n")

    # Generate 6 training samples and 2 validation samples
    for i in range(6):
        create_synthetic_sample(i, is_train=True)
    for i in range(2):
        create_synthetic_sample(i + 10, is_train=False)

    # Create dataset yaml config
    data_yaml_content = {
        "path": str(base_path.resolve()),
        "train": "images/train",
        "val": "images/val",
        "names": {
            0: "Placeholder_SKU_Box"
        }
    }

    yaml_path = base_path / "data.yaml"
    with open(yaml_path, "w") as f:
        yaml.dump(data_yaml_content, f, default_flow_style=False)

    print(f"[DatasetPrep] Placeholder dataset created successfully at: {base_path.resolve()}")
    print(f"[DatasetPrep] Config written to: {yaml_path.resolve()}")
    return str(yaml_path.resolve())


if __name__ == "__main__":
    generate_placeholder_dataset()
