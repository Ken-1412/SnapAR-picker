using UnityEngine;

namespace SnapAR.Spatial
{
    /// <summary>
    /// Implements Snapdragon Spaces Dual Render Fusion feature.
    /// Controls 2D operator UI mirroring on host phone screen while rendering 3D AR view in glasses display.
    /// </summary>
    public class DualRenderFusionController : MonoBehaviour
    {
        [Header("Dual Render Fusion Settings")]
        [SerializeField] private Canvas phoneScreenOperatorCanvas;
        [SerializeField] private Camera phoneScreenCamera;

        private bool isDualRenderingActive = false;

        private void Start()
        {
            InitializeDualRenderFusion();
        }

        public void InitializeDualRenderFusion()
        {
            if (phoneScreenOperatorCanvas != null && phoneScreenCamera != null)
            {
                // Snapdragon Spaces Dual Render Fusion routes phoneScreenCamera output to the phone's native display
                phoneScreenOperatorCanvas.worldCamera = phoneScreenCamera;
                phoneScreenOperatorCanvas.gameObject.SetActive(true);
                isDualRenderingActive = true;
                Debug.Log("[DualRenderFusionController] Dual Render Fusion initialized. Host phone screen configured for 2D operator view.");
            }
            else
            {
                Debug.LogWarning("[DualRenderFusionController] Phone screen Canvas or Camera reference not assigned.");
            }
        }

        public bool IsActive => isDualRenderingActive;
    }
}
