using System;
using System.Threading.Tasks;
using UnityEngine;
using UnityEngine.XR.ARFoundation;
using UnityEngine.XR.ARSubsystems;
using Unity.Collections;

namespace SnapAR.Spatial
{
    /// <summary>
    /// Captures frames from ARCameraManager and converts YUV420 CPU images to RGBA32 asynchronously on a background thread.
    /// Integrates with Snapdragon Spaces SDK camera perception bridge.
    /// </summary>
    public class CameraCaptureManager : MonoBehaviour
    {
        [SerializeField] private ARCameraManager cameraManager;
        
        public event Action<byte[], int, int> OnFrameConverted;
        
        private bool isProcessingFrame = false;
        private byte[] conversionBuffer;

        private void OnEnable()
        {
            if (cameraManager != null)
            {
                cameraManager.frameReceived += OnCameraFrameReceived;
            }
            else
            {
                Debug.LogWarning("[CameraCaptureManager] ARCameraManager reference is missing.");
            }
        }

        private void OnDisable()
        {
            if (cameraManager != null)
            {
                cameraManager.frameReceived -= OnCameraFrameReceived;
            }
        }

        private async void OnCameraFrameReceived(ARCameraFrameEventArgs eventArgs)
        {
            if (isProcessingFrame || cameraManager == null) return;

            if (!cameraManager.TryAcquireLatestCpuImage(out XRCpuImage image))
            {
                return;
            }

            isProcessingFrame = true;

            try
            {
                int width = image.width;
                int height = image.height;
                int bufferSize = width * height * 4; // RGBA32

                if (conversionBuffer == null || conversionBuffer.Length != bufferSize)
                {
                    conversionBuffer = new byte[bufferSize];
                }

                var conversionParams = new XRCpuImage.ConversionParams
                {
                    inputRect = new RectInt(0, 0, width, height),
                    outputDimensions = new Vector2Int(width, height),
                    outputFormat = TextureFormat.RGBA32,
                    transformation = XRCpuImage.Transformation.None
                };

                // Asynchronous conversion to prevent stalling the main render thread
                await Task.Run(() =>
                {
                    var rawData = new NativeArray<byte>(bufferSize, Allocator.Temp);
                    try
                    {
                        image.Convert(conversionParams, rawData);
                        rawData.CopyTo(conversionBuffer);
                    }
                    finally
                    {
                        rawData.Dispose();
                        image.Dispose();
                    }
                });

                OnFrameConverted?.Invoke(conversionBuffer, width, height);
            }
            catch (Exception ex)
            {
                Debug.LogError($"[CameraCaptureManager] Frame conversion failed: {ex.Message}");
                image.Dispose();
            }
            finally
            {
                isProcessingFrame = false;
            }
        }
    }
}
