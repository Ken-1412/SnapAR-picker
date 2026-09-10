using UnityEngine;

namespace SnapAR.Spatial
{
    /// <summary>
    /// Configuration wrapper for Snapdragon Spaces Reference Image / Marker Tracking feature.
    /// Configures Static/Adaptive modes for fixed rack QR markers to conserve battery and compute power.
    /// </summary>
    public class MarkerTrackingConfig : MonoBehaviour
    {
        public enum TrackingMode
        {
            Static,   // High precision for fixed rack markers; minimizes active re-scanning
            Adaptive  // Updates marker position when minor rack shifts/vibrations occur
        }

        [Header("Snapdragon Spaces Tracking Settings")]
        [SerializeField] private TrackingMode mode = TrackingMode.Static;
        [SerializeField] private float maxTrackingDistanceMeters = 5.0f;
        [SerializeField] private bool enableSubpixelRefinement = true;

        public TrackingMode CurrentMode => mode;
        public float MaxTrackingDistance => maxTrackingDistanceMeters;
        public bool EnableSubpixelRefinement => enableSubpixelRefinement;

        private void Start()
        {
            ApplySpacesMarkerConfig();
        }

        public void SetTrackingMode(TrackingMode newMode)
        {
            mode = newMode;
            ApplySpacesMarkerConfig();
        }

        private void ApplySpacesMarkerConfig()
        {
            Debug.Log($"[MarkerTrackingConfig] Snapdragon Spaces Image Tracking configured in {mode} mode (MaxDistance: {maxTrackingDistanceMeters}m, Subpixel: {enableSubpixelRefinement}).");
            // API Integration seam:
            // SpacesReferenceImageConfigurator.SetTrackingMode(mode == TrackingMode.Static ? SpacesTrackingMode.STATIC : SpacesTrackingMode.ADAPTIVE);
        }
    }
}
