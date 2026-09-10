# Field Validation & Physical Hardware Checklist

> [!IMPORTANT]
> **Status**: Blocked — Needs Human + Hardware.
> This document specifies the manual field validation checklist, physical hardware test procedures, thermal soak protocols, and operational KPI sign-off criteria required before deploying SnapAR Picker to a production warehouse environment.

---

## 1. Physical Hardware Setup & Environment Gates

| Check | Spec / Condition | Status | Inspector Sign-Off |
|---|---|---|---|
| **Host Device Firmware** | Motorola Edge+ pinned to Android 13 (`T1SHS33.35-23-20-6`). Auto-update disabled. | `[ ]` Pending | |
| **Glasses Firmware** | Lenovo ThinkReality A3 flashed to `≥ A3_user_S1127001_2303071610_sdm710_postcs8`. | `[ ]` Pending | |
| **Runtime Version** | OpenXR Plugin pinned to **exactly 1.10.0** in Unity app build. | `[ ]` Pending | |
| **Snapdragon Spaces Services** | Sideloaded `Snapdragon Spaces Services.apk` with Camera + `SYSTEM_ALERT_WINDOW` permissions. | `[ ]` Pending | |
| **NPU Execution Provider** | Verify log output confirms `QNNExecutionProvider` active with `libQnnHtp.so` (no CPU fallback). | `[ ]` Pending | |

---

## 2. Thermal & Battery Shift Soak Test (8–10 Hours)

### Test Protocol
1. Mount Lenovo ThinkReality A3 on head rig in simulated 28°C warehouse ambient environment.
2. Launch SnapAR Picker tethered to Motorola Edge+ on 100% initial battery.
3. Stream continuous 1080p @ 60fps camera feed into `QnnBackend` executing quantized W8A16 context binary.
4. Record surface temperature and battery percentage every 30 minutes.

### Pass/Fail Acceptance Criteria
- [ ] **Shift Battery Life**: Host device operates continuously for **≥ 8.0 hours** without external battery pack replacement.
- [ ] **Thermal Throttling**: NPU temperature remains below thermal throttle threshold (no drop from 60fps render rate to <30fps).
- [ ] **Overlay Stability**: Zero spatial drift or spatial mesh reset events across the 8-hour soak run.

---

## 3. Simulated Warehouse Picking Pilot

### Pilot Setup
- **Facility**: Simulated 3-aisle warehouse racking setup with 50 distinct SKU bin locations.
- **Participants**: 5 line pickers (3 experienced, 2 new hires during onboarding week).
- **Task**: Pick 50 randomly generated order manifests (average 12 items per order).

### Target Operational KPI Gates (From PRD)

| Metric | PRD Target | Baseline (Manual) | Pilot Measured | Sign-Off |
|---|---|---|---|---|
| **Detection-to-Overlay Latency** | **< 50 ms** end-to-end | N/A | `____ ms` | `[ ]` |
| **NPU Model Inference Time** | **≤ 10.7 ms** (Hexagon HTP) | ~52 ms (CPU) | `____ ms` | `[ ]` |
| **Picking Accuracy** | **≥ 95.0%** | 75.0% manual | `____ %` | `[ ]` |
| **System Failure / Mispick Rate**| **≤ 0.5%** | 2.5% industry std | `____ %` | `[ ]` |
| **Pick Time Reduction** | **20% – 30%** | Baseline standard | `____ %` | `[ ]` |
| **Peak Order Fulfillment Rate** | **~ 98.0%** | 82.0% static | `____ %` | `[ ]` |

---

## 4. Final Handoff & Field Sign-Off

Upon successful completion of all physical hardware checks, thermal soak tests, and pilot KPI verifications:

- **Warehouse Ops Lead Signature**: ___________________________  Date: ______________
- **AR Hardware Lead Signature**: ___________________________  Date: ______________
