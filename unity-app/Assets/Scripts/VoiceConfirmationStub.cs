using System;
using UnityEngine;

namespace SnapAR.Spatial
{
    /// <summary>
    /// Microphone capture shell and voice pick-confirmation callback stub.
    /// Provides a clean seam for future Whisper / local ASR model integration without changing UI layout.
    /// </summary>
    public class VoiceConfirmationStub : MonoBehaviour
    {
        public event Action<string> OnVoiceCommandRecognized;
        public event Action OnPickConfirmed;

        [SerializeField] private bool isListening = false;
        [SerializeField] private float sampleRate = 16000f;

        private AudioClip micClip;
        private string selectedDevice;

        private void Start()
        {
            InitializeMicrophone();
        }

        public void InitializeMicrophone()
        {
            if (Microphone.devices.Length > 0)
            {
                selectedDevice = Microphone.devices[0];
                Debug.Log($"[VoiceConfirmationStub] Selected audio input device: {selectedDevice}");
            }
            else
            {
                Debug.LogWarning("[VoiceConfirmationStub] No physical audio capture devices found. Operating in stub mode.");
            }
        }

        public void StartListening()
        {
            if (isListening) return;

            if (!string.IsNullOrEmpty(selectedDevice))
            {
                micClip = Microphone.Start(selectedDevice, true, 10, (int)sampleRate);
            }
            isListening = true;
            Debug.Log("[VoiceConfirmationStub] Voice listening activated.");
        }

        public void StopListening()
        {
            if (!isListening) return;

            if (!string.IsNullOrEmpty(selectedDevice) && Microphone.IsRecording(selectedDevice))
            {
                Microphone.End(selectedDevice);
            }
            isListening = false;
            Debug.Log("[VoiceConfirmationStub] Voice listening deactivated.");
        }

        /// <summary>
        /// Manual trigger seam for simulating voice pick confirmation (e.g. "CONFIRM", "PICKED", "CHECK").
        /// TODO: Replace this callback stub with local Whisper / ONNX ASR inference model output.
        /// </summary>
        public void SimulateVoiceConfirm(string phrase = "CONFIRM")
        {
            Debug.Log($"[VoiceConfirmationStub] Voice trigger received: '{phrase}'");
            OnVoiceCommandRecognized?.Invoke(phrase);

            if (phrase.Equals("CONFIRM", StringComparison.OrdinalIgnoreCase) || phrase.Equals("PICKED", StringComparison.OrdinalIgnoreCase))
            {
                OnPickConfirmed?.Invoke();
            }
        }
    }
}
