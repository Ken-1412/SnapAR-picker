# SnapAR Picker — AR Order-Picking MVP

SnapAR Picker puts a warehouse worker's next pick directly in their field of view — an arrow to the bin, a highlight on the SKU, and floating pick quantity text — computed entirely on-device on AR glasses (Lenovo ThinkReality A3 tethered to Motorola Edge+).

The system executes a quantized YOLOv8 model on the Qualcomm Hexagon NPU using ONNX Runtime with the QNN Execution Provider, driving a spatial overlay rendered in Unity via the Snapdragon Spaces SDK and OpenXR.

---

## Hardware vs. Software Feature Matrix

This repository separates fully automatable software components from physical hardware verification.

| System Feature / Component | Automated Software Status | Physical Hardware / Manual Verification Required |
|---|---|---|
| **Spatial UI / Unity Scripts** | **100% Built** (`CameraCaptureManager`, `OverlayRenderer`, `MarkerTrackingConfig`, `DualRenderFusionController`, `VoiceConfirmationStub`, `CoordinateTransform`) | Require Unity 2022.3 LTS Editor build & OpenXR 1.10.0 runtime on physical headset ([`docs/manual-steps-frontend.md`](file:///d:/Downloads/snapar-picker/docs/manual-steps-frontend.md)). |
| **Spatial Coordinate Projection** | **100% Built & Verified** (`CoordinateTransform.cs` + `pytest tests/test_coordinate_transform.py` passing) | Real spatial mesh anchor alignment requires camera frame intrinsics calibration on physical A3 glasses. |
| **Inference Bridge Runtime** | **100% Built & Verified** (`CpuBackend` & `QnnBackend` in `inference_backend.py`, `tensor_bridge.py`, `pytest tests/test_inference_backend.py` passing) | Real Hexagon NPU execution (`libQnnHtp.so`) requires Snapdragon 8 Gen 1 hardware ([`docs/field-validation-checklist.md`](file:///d:/Downloads/snapar-picker/docs/field-validation-checklist.md)). |
| **ML Training & Export** | **100% Built & Verified** (`prepare_dataset.py`, `train.py`, `export.py` exporting `yolov8n_picker.onnx` validated via ONNX Runtime) | Real SKU dataset collection from target warehouse facility ([`ml/dataset/README.md`](file:///d:/Downloads/snapar-picker/ml/dataset/README.md)). |
| **QNN Quantization & Compilation** | **100% Built & Verified** (`quantize.py` API integration script with `.env.example` token validation) | Submitting job to Qualcomm AI Hub requires active `QAI_HUB_API_TOKEN` to generate `.bin` context file. |
| **Local Proxy Benchmarking** | **100% Built & Verified** (`benchmark.py` logging CPU proxy latency) | Measuring actual target latency (<10.7ms HTP / sub-50ms end-to-end) requires physical device run. |
| **End-to-End Integration** | **100% Built & Verified** (`pytest tests/integration_test.py` passing end-to-end flow) | Field validation (8-10h thermal soak, picking accuracy ≥95%, failure rate ≤0.5%) requires warehouse pilot ([`docs/field-validation-checklist.md`](file:///d:/Downloads/snapar-picker/docs/field-validation-checklist.md)). |

---

## Directory Layout

```text
/docs                 # Product specs & manual runbooks (PRD.md, manual-steps-frontend.md, field-validation-checklist.md)
/ml                   # YOLOv8 dataset prep, fine-tuning, ONNX export, QAI Hub quantize, benchmark
/inference-bridge     # ONNX Runtime CPU & QNN Execution Provider backend abstraction & tensor preprocessor
/unity-app            # Unity project C# scripts (Assets/Scripts/) for Snapdragon Spaces spatial UI
/scripts              # Auxiliary automation scripts
/tests                # Pytest unit & end-to-end integration test suite
PROGRESS.md           # Stage-by-stage completion and evidence log
```

---

## Quick Start & Local Verification

### 1. Environment Setup
```powershell
python -m venv .venv
.\.venv\Scripts\pip.exe install -r requirements.txt
```

### 2. Run Test Suite
```powershell
# Run coordinate math unit tests
.\.venv\Scripts\pytest.exe tests/test_coordinate_transform.py

# Run inference backend tests
.\.venv\Scripts\pytest.exe -s tests/test_inference_backend.py

# Run full end-to-end integration test
.\.venv\Scripts\pytest.exe -s tests/integration_test.py
```

### 3. Run ML Pipeline Smoke Test
```powershell
# Generate synthetic dataset
.\.venv\Scripts\python.exe ml/prepare_dataset.py

# Fine-tune YOLOv8-nano for 1 epoch
.\.venv\Scripts\python.exe ml/train.py --epochs 1

# Export PyTorch model to ONNX
.\.venv\Scripts\python.exe ml/export.py --weights runs/detect/ml/runs/train_smoke/weights/best.pt --output ml/weights/yolov8n_picker.onnx

# Run local CPU proxy benchmark
.\.venv\Scripts\python.exe ml/benchmark.py --model ml/weights/yolov8n_picker.onnx --iters 10
```
