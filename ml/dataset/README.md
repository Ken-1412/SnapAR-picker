# Warehouse SKU Dataset Collection & Labeling Guide

This process guide describes how facility-specific SKU images should be collected, annotated, and formatted for fine-tuning YOLOv8 for the SnapAR Picker application.

---

## 1. Image Collection Protocol

1. **Environmental Lighting & Conditions**:
   - Capture images under varied warehouse lighting (ambient fluorescent overheads, direct LED shelf lights, low-light basement aisles).
   - Include reflections, shadows, and plastic wrap glares typical of wholesale racking.
2. **Camera Hardware**:
   - Use the camera hardware on the target headset (Lenovo ThinkReality A3 / 1080p RGB sensor) or host phone (Motorola Edge+) to match optical intrinsics.
3. **Angles & Distances**:
   - Capture images from typical picker viewing distances: 0.5m to 3.0m.
   - Include direct front-facing shelf views, 45° aisle approach angles, and partial occlusions by adjacent boxes or hand grips.

---

## 2. YOLO Annotation Format

All labels must strictly follow the standard YOLO bounding box format:
- Each image (`image_001.jpg`) must have a corresponding text file (`image_001.txt`) in the same directory.
- Each line in the text file represents one bounding box:
  ```text
  <class_id> <x_center> <y_center> <width> <height>
  ```
  Where `x_center`, `y_center`, `width`, and `height` are normalized floats in the range `[0.0, 1.0]` relative to total image dimensions.

### Directory Structure

```text
/ml/dataset/
├── data.yaml
├── train/
│   ├── images/
│   │   ├── sku_001.jpg
│   │   └── sku_002.jpg
│   └── labels/
│       ├── sku_001.txt
│       └── sku_002.txt
└── val/
    ├── images/
    │   └── sku_val_001.jpg
    └── labels/
        └── sku_val_001.txt
```

---

## 3. Dataset Configuration (`data.yaml`)

Example `data.yaml` configuration for facility SKUs:
```yaml
path: ../dataset
train: train/images
val: val/images

names:
  0: Carton_SKU_A
  1: Produce_Crate_B
  2: Electronic_Box_C
```
