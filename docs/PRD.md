# SnapAR Picker — Product Requirements & Build Plan

**Doc code:** SNAPAR-PRD-01 · **Version:** v0.1 draft · **Date:** 09 Sep 2026

---

## 1. Overview

SnapAR Picker puts a warehouse worker's next pick directly in their field of view — an arrow to the bin, a highlight on the SKU, the quantity to take — computed entirely on a pair of AR glasses. No phone screen to look down at, no cloud round-trip to wait on, and no paper manifest to hold in one hand while the other reaches for stock.

It's the first of several edge-AI concepts scoped for the Snapdragon platform across Asian wholesale and retail logistics, chosen because order picking is both the single largest line item in warehouse labor cost and the most mechanically simple problem to prove the platform on before tackling translation, quality inspection, or drone audits.

### Who this is for

| Persona | Context | Need |
|---|---|---|
| Line picker | Mid-size wholesale distributor, China or Indonesia | Find the right SKU fast in a dense, visually repetitive aisle without staring at a phone or a paper manifest. |
| New hire | Onboarding week, mega-market or regional warehouse | Get productive in days, not weeks, without memorizing a facility with millions of SKUs. |
| Warehouse ops lead | Owns picking throughput and labor cost | Cut mispicks and idle walking time without adding new handheld hardware workers have to hold and look down at. |

### Definition of done — MVP

A working demo on a Lenovo ThinkReality A3 tethered to a Motorola Edge+, running a quantized YOLOv8 model on-device, that guides a worker through a real pick sequence at under 50ms detection-to-overlay latency, hitting ≥95% detection accuracy — built inside a 30-day sprint, ordered **frontend → backend → model pipeline → integration**.

### Headline numbers

| | |
|---|---|
| **800K+** | stalls inside Yiwu's wholesale hub alone |
| **90%** | of a picker's shift spent walking and searching |
| **95% / 0.5%** | target detection accuracy / failure rate |
| **10.7 ms** | YOLOv8-nano inference on the Hexagon NPU |

---

## 2. Problem & Opportunity

Two very different markets are converging on the same physical bottleneck.

### China's wholesale hubs

- Yiwu International Trade City alone runs roughly 800,000 stalls across over 2.1 million SKUs, with product variety estimated above 210 million distinct items.
- Storefronts are digitized — e-commerce, ERP, AI design tools — but the physical floor still runs on memory, paper manifests, and basic barcode scans.
- Multiple intermediary layers (manufacturers, regional traders, cross-border livestream buyers) add coordination delay and margin compression.
- Buyers and sellers frequently share no common language, and switching between a translation app and the physical product breaks the negotiation.

### Indonesia's retail network

- About 75% of agricultural households are micro-farms, moving goods through layers of intermediate traders into traditional wet markets.
- Only around 25% of MSMEs use any online coordination platform — low digital literacy and inconsistent connectivity are the limiting factors, not willingness.
- Digital connectivity scores roughly 14 in remote regions vs. 49 in centralized hubs like Java, which rules out cloud-dependent tools outside major cities.
- Retailers fall back on consumer messaging apps and local spreadsheets, with real losses from spoilage and invoice mismatches.

### The core failure point

In both markets the failure point is the same: **the physical workflow** — finding the SKU, counting it, picking it, inspecting it — not the digital layer sitting on top of it.

### Why software-only tools haven't fixed this

- A phone or tablet demands a hand and the worker's eyes, forcing constant mental mapping between a 2D screen and the 3D shelf in front of them.
- Cloud-dependent apps break down in the basements of Chinese wholesale markets and in low-connectivity Indonesian regions where the network simply isn't there.
- Barcode scanners need close-range, one-item-at-a-time interaction and can't reason about a whole scene or the worker's orientation in it.

### The cost of the status quo

Picking already consumes up to 90% of a warehouse worker's time and roughly 55% of total warehouse operating expense. On a typical **$500K/yr** picking-labor budget, a 20% time reduction — already shown in Hong Kong AR pilots — is worth about **$100K/yr** in direct savings.

---

## 3. Requirements

### Goals & success metrics

| Metric | Target | Baseline |
|---|---|---|
| Picking accuracy | ≥ 95% | 75% manual baseline |
| Failure rate | ≤ 0.5% | 2.5% industry standard |
| Order fulfillment rate | ≈ 98% at peak demand | 82% with static routing |
| Pick time reduction | 20–30% | vs. manual picking |
| Detection-to-overlay latency | < 50 ms end to end | 60 fps AR render target |
| Shift battery life | 8–10 hrs continuous | no thermal throttling |

### Scope

**In scope for the MVP**
- Real-time SKU detection through the glasses' camera feed
- Spatial pick overlay: directional arrow + bin highlight + pick quantity
- Fully on-device inference — zero cloud round-trip
- Static/adaptive marker tracking for fixed, QR-coded rack locations
- Mirrored 2D operator view on the tethered host phone

**Deferred / roadmap** (real candidates on the same platform, deliberately not in the MVP so the core picking loop gets proven first)
- Cross-border translation / multilingual negotiation support
- Produce quality inspection & spoilage detection
- Cold-chain temperature audit trails
- Autonomous drone inspection of high racking
- Digital twin synchronization
- Voice-guided compliance auditing

### Functional requirements

| ID | Priority | Requirement | Detail |
|---|---|---|---|
| FR1 | P0 | Real-time SKU detection | Detect and classify target SKUs from the glasses' live camera feed using an on-device YOLOv8 model. |
| FR2 | P0 | Spatial pick overlay | Anchor a directional arrow and bin highlight to the physical rack location of the detected SKU. |
| FR3 | P0 | Pick quantity display | Render the required pick quantity as floating text locked to the target bin. |
| FR4 | P1 | Voice pick confirmation | Let the worker confirm a completed pick by voice, so hands stay free — stretch goal for the MVP. |
| FR5 | P1 | Fixed-marker tracking | Use static/adaptive QR tracking for bolted-down rack markers to reduce continuous re-scanning cost. |
| FR6 | P1 | Dual render fusion | Mirror a 2D control view on the host phone's own screen alongside the 3D AR view in the glasses. |

### Non-functional requirements

| ID | Requirement | Detail |
|---|---|---|
| NFR1 | Latency | Sub-50ms detection-to-overlay so holograms don't visibly lag head movement. |
| NFR2 | Offline-first | All inference and spatial logic run on-device; no cloud dependency for core picking. |
| NFR3 | Thermal & battery | 8–10hr continuous operation across a shift without throttling-induced frame drops. |
| NFR4 | Accuracy floor | ≥95% detection accuracy and ≤0.5% failure rate before field pilot sign-off. |
| NFR5 | Model footprint | W8A16 quantization to keep the compiled model near 3.6MB for fast load and low memory pressure. |

### Risks & mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Android 14 auto-update lands on the host device | Breaks Snapdragon Spaces compatibility outright | Disable auto-update at provisioning; pin Android 13 (T1SHS33.35-23-20-6) in Phase 1, step 2. |
| OpenXR plugin drifts off version | Black screens, rendering crashes | Force OpenXR to exactly 1.10.0 in the Unity package manifest; treat as a release gate, not a default. |
| QNN Execution Provider silently falls back to CPU | Inference time jumps ~5x, overlay lags visibly | Add explicit logging that asserts NPU execution on every session init (Phase 2, step 6). |
| Base YOLOv8 doesn't recognize facility-specific SKUs | Accuracy floor missed before quantization even starts | Collect a real warehouse calibration dataset before fine-tuning (Phase 3, step 1) — don't skip to quantization on the stock model. |
| Sustained NPU load triggers thermal throttling | Frame drops mid-shift, degraded overlay tracking | Dedicated soak test across a full simulated shift in Phase 4 before field pilot. |

---

## 4. Build Plan

Ordered the way it was asked for — **frontend first, then backend, then the model pipeline** — with integration to close it out.

> **Note:** The YOLO/ML pipeline (Phase 3) has no hard dependency on Phases 1–2 — dataset collection and fine-tuning can start on day one in parallel if the calendar needs compressing. The sequence below is the dependency-safe default: build the thing you can see and touch first, then the runtime underneath it, then the model that feeds it real data, then wire all three together.

### Phase 1 — Frontend (Spatial UI / Unity client)

Get the glasses, the host phone, and the Unity spatial app talking to each other, and get overlays rendering — using stubbed detections before any real model is wired in.

1. **Provision the AR hardware** — Unbox the Lenovo ThinkReality A3 glasses and the Motorola Edge+ host (Snapdragon 8 Gen 1); pair over the USB-C tether.
2. **Lock host firmware** — Update the host to Android 13 (min build T1SHS33.35-23-20-6) and disable auto-update — Android 14 breaks Spaces compatibility outright.
3. **Install the Spaces runtime** — Sideload `Snapdragon Spaces Services.apk` via ADB; grant camera access and the "display over other apps" permission — without both, spatial tracking fails silently.
4. **Push glasses firmware** — Install the Lenovo Universal Device Client, register the A3, and use TR Hub to push firmware ≥ `A3_user_S1127001_2303071610_sdm710_postcs8`.
5. **Scaffold the Unity project** — Unity 2022.3 LTS, import the Snapdragon Spaces SDK, force the OpenXR plugin to exactly 1.10.0, enable the Camera Access feature group.
6. **Validate spatial tracking** — Run a bare scene and confirm the glasses map the room cleanly before building any UI on top of it.
7. **Build the camera capture pipeline** — `ARCameraManager.frameReceived` → `TryAcquireLatestCpuImage` → `ConvertAsync` (YUV420 → RGBA32) on a background thread so the render loop never stalls.
8. **Add fixed-marker tracking** — Configure `SpacesReferenceImageConfigurator` in Static/Adaptive mode for bolted-down, QR-coded rack markers to save power.
9. **Design the AR overlay layer** — Directional arrow to the target bin, bounding-box highlight on the SKU, floating pick-quantity text — anchored to the rack using stubbed coordinates for now.
10. **Add the host-side control screen** — Dual Render Fusion: mirror a 2D operator view on the Motorola's own screen while the 3D view renders in the glasses.
11. **Stub the voice UI shell** — Add a mic-capture and push-to-confirm hook now so a local Whisper model can be dropped in later without touching the UI.

### Phase 2 — Backend (On-device inference runtime)

Wire the ONNX Runtime and QNN Execution Provider into the app so it can actually run a model on the Hexagon NPU, and route real inference output back into the overlay pipeline built in Phase 1.

1. **Add the ONNX Runtime + QNN Execution Provider** — Integrate `onnxruntime-qnn` into Unity's native plugin layer.
2. **Target the Hexagon NPU explicitly** — Set SessionOptions: `backend_path` → `libQnnHtp.so`, `htp_performance_mode` → `burst`, `enable_htp_shared_memory_allocator` → `1`.
3. **Wire up the context-binary cache** — Set `ep.context_enable = 1` and point at the compiled `.bin` so the runtime skips graph recompilation and loads straight into the HTP.
4. **Build the tensor bridge** — Convert the RGBA32 frames from the Phase 1 capture pipeline into contiguous input tensors and feed the ONNX session.
5. **Route inference output back to the overlay** — Intercept bounding boxes and class probabilities, transform 2D pixel coordinates into the 3D spatial mesh Unity anchors overlays to — replacing the Phase 1 stub coordinates.
6. **Log NPU execution explicitly** — Confirm every inference call actually lands on the NPU rather than silently falling back to CPU — this failure mode is easy to miss and costs ~5x latency.
7. **Handle degraded states** — Add error handling for dropped frames, thermal-throttle signals, and session-init failures so the overlay degrades gracefully instead of freezing.

### Phase 3 — YOLO / ML Pipeline (Detection model, training & quantization)

Take YOLOv8 from a generic pretrained model to a facility-tuned, quantized context binary that actually hits the accuracy and latency bar. This can run in parallel with Phases 1–2 if you want to compress the calendar.

1. **Collect a facility-specific dataset** — Photograph the actual SKUs — carton form factors, produce crates, whatever the pilot facility stocks. Base YOLOv8 pretraining won't recognize highly specific stock units.
2. **Fine-tune YOLOv8-nano** — Fine-tune the nano variant (it fits the power/latency budget) on the collected dataset; validate against a held-out set before touching quantization.
3. **Export to ONNX, then to the QNN graph** — Export the fine-tuned model to ONNX, then run the Qualcomm AI Hub's `qnn-onnx-converter` to produce the QNN graph representation.
4. **Apply W8A16 static quantization** — Quantize weights to 8-bit and activations to 16-bit using representative warehouse imagery for calibration — this is what takes the model from ~12MB to ~3.6MB.
5. **Compile the context binary** — Compile the quantized graph to a `qnn_context_binary` (`.bin`), targeting architecture 69 — the Snapdragon 8 Gen 1 HTP.
6. **Benchmark on real silicon** — Use QNN profiling tools to confirm NPU inference lands near ~10.7ms (vs. ~52ms on CPU) — the number the whole real-time overlay experience depends on.
7. **Validate against the MVP accuracy bar** — Confirm ≥95% picking accuracy and ≤0.5% failure rate before handing the binary to Phase 2, step 3.

### Phase 4 — Integration & Field Validation

Frontend, backend, and model pipeline meet here. Nothing in this phase is new engineering — it's wiring, measuring, and hardening what Phases 1–3 already built.

1. **Wire the three pipelines end to end** — Confirm sub-50ms detection-to-overlay latency at 60fps so AR overlays track head movement without visible lag.
2. **Run thermal & battery soak tests** — Simulate a full 8–10hr shift and watch for throttling-driven frame drops.
3. **Pilot in a simulated warehouse** — Measure pick time and error rate against the manual baseline, targeting the 20–30% time reduction and 95% accuracy goals.
4. **Fix, iterate, sign off** — Close out gaps found in the pilot and sign off for an enterprise field deployment.

---

## 5. Architecture Reference

### Hardware

| Component | Spec | Role |
|---|---|---|
| AR display | Lenovo ThinkReality A3 | Optical passthrough headset, worn by the picker |
| Host / compute | Motorola Edge+ (Snapdragon 8 Gen 1) | Tethered compute unit running inference + app logic |
| AI accelerator | Hexagon NPU | Fused scalar/vector/tensor accelerator with shared memory pool |
| Scale-up option | Snapdragon X Elite (up to 45 TOPS) | For heavier, multi-day workloads beyond the MVP |

### Software stack

| Layer | Tool | Purpose |
|---|---|---|
| Engine | Unity 2022.3 LTS | Spatial app runtime |
| Spatial runtime | Snapdragon Spaces SDK + OpenXR 1.10.0 | Perception, tracking, camera bridge |
| Model compiler | Qualcomm AI Hub + QNN SDK | Quantize & compile YOLOv8 for the Hexagon NPU |
| Inference runtime | ONNX Runtime + `onnxruntime-qnn` | Executes the compiled model on-device |

### Pinned configuration — treat every row as a release gate

| Key | Value |
|---|---|
| Host OS (min) | Android 13 — T1SHS33.35-23-20-6 |
| Glasses firmware (min) | A3_user_S1127001_2303071610_sdm710_postcs8 |
| OpenXR plugin | 1.10.0 — pinned, do not drift |
| Quantization | W8A16 (8-bit weights, 16-bit activations) |
| Compile target | Architecture 69 (Snapdragon 8 Gen 1 HTP) |
| HTP backend | libQnnHtp.so, performance mode = burst |

---

*SnapAR Picker · v0.1 draft · 09 Sep 2026*
