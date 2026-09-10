using System;

namespace SnapAR.Spatial
{
    /// <summary>
    /// Pure, framework-decoupled coordinate transformation math.
    /// Maps 2D pixel bounding boxes from camera frame space to 3D camera/spatial coordinates.
    /// Free of UnityEngine / Unity Editor runtime dependencies for external testability.
    /// </summary>
    public static class CoordinateTransform
    {
        public struct Vector3D
        {
            public float X;
            public float Y;
            public float Z;

            public Vector3D(float x, float y, float z)
            {
                X = x;
                Y = y;
                Z = z;
            }

            public override bool Equals(object obj)
            {
                if (!(obj is Vector3D)) return false;
                Vector3D other = (Vector3D)obj;
                return Math.Abs(X - other.X) < 1e-4f && Math.Abs(Y - other.Y) < 1e-4f && Math.Abs(Z - other.Z) < 1e-4f;
            }

            public override int GetHashCode()
            {
                return HashCode.Combine(X, Y, Z);
            }
        }

        public struct BoundingBox2D
        {
            public float XMin;
            public float YMin;
            public float XMax;
            public float YMax;
            public float Confidence;
            public int ClassId;

            public BoundingBox2D(float xMin, float yMin, float xMax, float yMax, float confidence = 1.0f, int classId = 0)
            {
                XMin = xMin;
                YMin = yMin;
                XMax = xMax;
                YMax = yMax;
                Confidence = confidence;
                ClassId = classId;
            }

            public (float CenterX, float CenterY) GetCenter()
            {
                return ((XMin + XMax) / 2.0f, (YMin + YMax) / 2.0f);
            }
        }

        public struct CameraIntrinsics
        {
            public float Fx;
            public float Fy;
            public float Cx;
            public float Cy;
            public int Width;
            public int Height;

            public CameraIntrinsics(float fx, float fy, float cx, float cy, int width, int height)
            {
                Fx = fx;
                Fy = fy;
                Cx = cx;
                Cy = cy;
                Width = width;
                Height = height;
            }

            public static CameraIntrinsics Default1080p => new CameraIntrinsics(
                fx: 1000.0f,
                fy: 1000.0f,
                cx: 960.0f,
                cy: 540.0f,
                width: 1920,
                height: 1080
            );
        }

        /// <summary>
        /// Projects 2D pixel center to 3D point in camera optical frame given distance Z.
        /// Formula: X = (u - cx) * Z / fx; Y = (v - cy) * Z / fy; Z = Z
        /// </summary>
        public static Vector3D PixelToCameraSpace(float pixelX, float pixelY, float depthZ, CameraIntrinsics intrinsics)
        {
            if (intrinsics.Fx <= 0 || intrinsics.Fy <= 0)
                throw new ArgumentException("Focal length must be strictly positive.");
            if (depthZ <= 0)
                throw new ArgumentException("Depth Z must be positive.");

            float x = (pixelX - intrinsics.Cx) * depthZ / intrinsics.Fx;
            // Invert Y for standard camera coordinate systems (Y down in pixels -> Y up in 3D)
            float y = -(pixelY - intrinsics.Cy) * depthZ / intrinsics.Fy;
            return new Vector3D(x, y, depthZ);
        }

        /// <summary>
        /// Estimates spatial anchor point from 2D bounding box and estimated object depth.
        /// </summary>
        public static Vector3D BoundingBoxToSpatialAnchor(BoundingBox2D box, float depthZ, CameraIntrinsics intrinsics)
        {
            var (cx, cy) = box.GetCenter();
            return PixelToCameraSpace(cx, cy, depthZ, intrinsics);
        }
    }
}
