# Manual Hardware Provisioning & Frontend Setup Runbook

> [!IMPORTANT]
> **Status**: Blocked — Needs Human + Hardware.
> This document details the mandatory manual hardware provisioning, firmware flashing, and Unity Editor setup steps required to deploy the SnapAR Picker spatial application to a Lenovo ThinkReality A3 headset and Motorola Edge+ host device.

---

## 1. Unity Project & Package Setup

1. **Install Unity Engine**:
   - Download and install **Unity 2022.3 LTS** (Recommended: 2022.3.20f1 or later 2022.3 LTS release) via Unity Hub with the **Android Build Support** module (including Android SDK & NDK tools and OpenJDK).
2. **Import Snapdragon Spaces SDK**:
   - Download the latest **Snapdragon Spaces Unity Package** tarball (`com.qualcomm.snapdragon.spaces.tgz`).
   - In Unity, navigate to **Window > Package Manager > + > Add package from tarball...** and select the Snapdragon Spaces package.
3. **Pin OpenXR Plugin Version**:
   - In Package Manager, select **OpenXR Plugin**.
   - Verify and force the OpenXR plugin version to **exactly 1.10.0**.
   - *Warning*: Version drift will cause black screen crashes and spatial tracking failure on the A3 display.
4. **Configure Project Settings & Camera Access**:
   - Navigate to **Project Settings > XR Plug-in Management > Android settings tab**.
   - Enable **OpenXR** as the plug-in provider.
   - Under OpenXR feature groups, check **Snapdragon Spaces** and enable the **Camera Access** feature group.

---

## 2. Host Device (Motorola Edge+) Provisioning

1. **Host Firmware Verification & Auto-Update Lock**:
   - Connect the Motorola Edge+ (Snapdragon 8 Gen 1) to Wi-Fi.
   - Verify Android version is **Android 13** with build number **≥ T1SHS33.35-23-20-6**.
   - **CRITICAL**: Go to **Settings > System > System updates** and **DISABLE automatic updates**.
   - *Warning*: Android 14 breaks Snapdragon Spaces HAL compatibility.
2. **Enable Developer Options & USB Debugging**:
   - Go to **Settings > About phone** and tap **Build number** 7 times.
   - Go to **Settings > System > Developer options** and enable **USB debugging**.
3. **Sideload Snapdragon Spaces Services**:
   - Connect the Motorola Edge+ to host machine via USB-C.
   - Sideload `Snapdragon Spaces Services.apk` using ADB:
     ```bash
     adb install -r -g SnapdragonSpacesServices.apk
     ```
4. **Grant Mandatory Permissions**:
   - Grant Camera permission:
     ```bash
     adb shell pm grant com.qualcomm.snapdragon.spaces.services android.permission.CAMERA
     ```
   - Grant "Display over other apps" (SYSTEM_ALERT_WINDOW) permission:
     ```bash
     adb shell appops set com.qualcomm.snapdragon.spaces.services SYSTEM_ALERT_WINDOW allow
     ```

---

## 3. AR Glasses (Lenovo ThinkReality A3) Firmware Flashing

1. **Lenovo UDC Registration**:
   - Install the **Lenovo Universal Device Client (UDC)** on the host machine or tethered device.
   - Register the ThinkReality A3 glasses.
2. **Firmware Push via ThinkReality Hub**:
   - Open ThinkReality Hub (TR Hub).
   - Check glasses firmware version.
   - Flash firmware to **≥ A3_user_S1127001_2303071610_sdm710_postcs8**.
3. **Hardware Tethering Verification**:
   - Connect the ThinkReality A3 glasses to the Motorola Edge+ using the USB-C display port cable.
   - Launch Snapdragon Spaces Services app on the phone and verify glasses connection and display passthrough.
