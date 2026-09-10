using UnityEngine;
using TMPro;

namespace SnapAR.Spatial
{
    /// <summary>
    /// Renders spatial AR pick overlays: directional arrow pointing to target bin, 
    /// bounding box highlight around target SKU, and floating pick-quantity text locked to 3D spatial coordinates.
    /// </summary>
    public class OverlayRenderer : MonoBehaviour
    {
        [Header("Overlay Visual Components")]
        [SerializeField] private GameObject directionalArrowPrefab;
        [SerializeField] private GameObject binHighlightPrefab;
        [SerializeField] private TextMeshPro pickQuantityText;

        [Header("Target State")]
        private Vector3 currentTargetPosition;
        private int currentPickQuantity = 1;
        private string currentSkuId = "SKU-DEMO-001";
        private bool isTargetActive = false;

        private GameObject instantiatedArrow;
        private GameObject instantiatedHighlight;

        private void Awake()
        {
            if (directionalArrowPrefab != null)
            {
                instantiatedArrow = Instantiate(directionalArrowPrefab, transform);
                instantiatedArrow.SetActive(false);
            }
            if (binHighlightPrefab != null)
            {
                instantiatedHighlight = Instantiate(binHighlightPrefab, transform);
                instantiatedHighlight.SetActive(false);
            }
        }

        private void Update()
        {
            if (!isTargetActive) return;

            // Orient directional arrow towards target position relative to camera/headset
            if (instantiatedArrow != null && Camera.main != null)
            {
                Vector3 headPosition = Camera.main.transform.position;
                Vector3 directionToBin = (currentTargetPosition - headPosition).normalized;
                instantiatedArrow.transform.position = headPosition + headPosition + directionToBin * 0.5f;
                instantiatedArrow.transform.rotation = Quaternion.LookRotation(directionToBin);
            }

            // Position bin highlight box directly at target 3D anchor
            if (instantiatedHighlight != null)
            {
                instantiatedHighlight.transform.position = currentTargetPosition;
            }

            // Position and billboard pick-quantity text above bin
            if (pickQuantityText != null && Camera.main != null)
            {
                pickQuantityText.transform.position = currentTargetPosition + Vector3.up * 0.25f;
                pickQuantityText.transform.rotation = Quaternion.LookRotation(pickQuantityText.transform.position - Camera.main.transform.position);
                pickQuantityText.text = $"SKU: {currentSkuId}\nQTY: {currentPickQuantity}";
            }
        }

        /// <summary>
        /// Updates overlay anchor position and metadata using detection results.
        /// </summary>
        public void UpdateSpatialTarget(Vector3 targetSpatialPos, string skuId, int quantity)
        {
            currentTargetPosition = targetSpatialPos;
            currentSkuId = skuId;
            currentPickQuantity = quantity;
            isTargetActive = true;

            if (instantiatedArrow != null) instantiatedArrow.SetActive(true);
            if (instantiatedHighlight != null) instantiatedHighlight.SetActive(true);
            if (pickQuantityText != null) pickQuantityText.gameObject.SetActive(true);
        }

        /// <summary>
        /// Clears current target overlay upon pick completion.
        /// </summary>
        public void ClearTarget()
        {
            isTargetActive = false;
            if (instantiatedArrow != null) instantiatedArrow.SetActive(false);
            if (instantiatedHighlight != null) instantiatedHighlight.SetActive(false);
            if (pickQuantityText != null) pickQuantityText.gameObject.SetActive(false);
        }

        /// <summary>
        /// Stubbed bounding-box input simulation helper for Stage 1 frontend development without real NPU pipeline.
        /// </summary>
        public void SimulateStubbedDetection(float pixelX, float pixelY, float depthZ)
        {
            var intrinsics = CoordinateTransform.CameraIntrinsics.Default1080p;
            var box = new CoordinateTransform.BoundingBox2D(pixelX - 50, pixelY - 50, pixelX + 50, pixelY + 50, 0.95f, 1);
            var anchor = CoordinateTransform.BoundingBoxToSpatialAnchor(box, depthZ, intrinsics);
            
            UpdateSpatialTarget(new Vector3(anchor.X, anchor.Y, anchor.Z), "SKU-STUB-101", 3);
        }
    }
}
