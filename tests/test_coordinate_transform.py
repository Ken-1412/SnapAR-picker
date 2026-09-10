import pytest
import math

class Vector3D:
    def __init__(self, x: float, y: float, z: float):
        self.x = x
        self.y = y
        self.z = z

    def __eq__(self, other):
        if not isinstance(other, Vector3D):
            return False
        return (math.isclose(self.x, other.x, abs_tol=1e-4) and
                math.isclose(self.y, other.y, abs_tol=1e-4) and
                math.isclose(self.z, other.z, abs_tol=1e-4))

    def __repr__(self):
        return f"Vector3D(x={self.x:.4f}, y={self.y:.4f}, z={self.z:.4f})"


class BoundingBox2D:
    def __init__(self, x_min: float, y_min: float, x_max: float, y_max: float, confidence: float = 1.0, class_id: int = 0):
        self.x_min = x_min
        self.y_min = y_min
        self.x_max = x_max
        self.y_max = y_max
        self.confidence = confidence
        self.class_id = class_id

    def get_center(self):
        return (self.x_min + self.x_max) / 2.0, (self.y_min + self.y_max) / 2.0


class CameraIntrinsics:
    def __init__(self, fx: float, fy: float, cx: float, cy: float, width: int, height: int):
        self.fx = fx
        self.fy = fy
        self.cx = cx
        self.cy = cy
        self.width = width
        self.height = height

    @classmethod
    def default_1080p(cls):
        return cls(fx=1000.0, fy=1000.0, cx=960.0, cy=540.0, width=1920, height=1080)


def pixel_to_camera_space(pixel_x: float, pixel_y: float, depth_z: float, intrinsics: CameraIntrinsics) -> Vector3D:
    if intrinsics.fx <= 0 or intrinsics.fy <= 0:
        raise ValueError("Focal length must be strictly positive.")
    if depth_z <= 0:
        raise ValueError("Depth Z must be positive.")

    x = (pixel_x - intrinsics.cx) * depth_z / intrinsics.fx
    y = -(pixel_y - intrinsics.cy) * depth_z / intrinsics.fy
    return Vector3D(x, y, depth_z)


def bounding_box_to_spatial_anchor(box: BoundingBox2D, depth_z: float, intrinsics: CameraIntrinsics) -> Vector3D:
    cx, cy = box.get_center()
    return pixel_to_camera_space(cx, cy, depth_z, intrinsics)


# --- Unit Tests for CoordinateTransform Math ---

def test_principal_point_projection_at_1m():
    intrinsics = CameraIntrinsics.default_1080p()
    # A pixel at the optical center (960, 540) at depth 1.0m should map to 3D origin (0, 0, 1.0)
    point_3d = pixel_to_camera_space(960.0, 540.0, 1.0, intrinsics)
    assert point_3d == Vector3D(0.0, 0.0, 1.0)


def test_off_center_bounding_box_projection():
    intrinsics = CameraIntrinsics.default_1080p() # fx=1000, fy=1000, cx=960, cy=540
    # Box centered at (1160, 340) -> offset (+200, -200) pixels
    box = BoundingBox2D(x_min=1110.0, y_min=290.0, x_max=1210.0, y_max=390.0)
    
    # At depth Z = 2.0m:
    # X = (1160 - 960) * 2.0 / 1000 = 200 * 2.0 / 1000 = 0.4m
    # Y = -(340 - 540) * 2.0 / 1000 = -(-200) * 2.0 / 1000 = 0.4m
    anchor = bounding_box_to_spatial_anchor(box, 2.0, intrinsics)
    assert anchor == Vector3D(0.4, 0.4, 2.0)


def test_invalid_depth_throws():
    intrinsics = CameraIntrinsics.default_1080p()
    with pytest.raises(ValueError, match="Depth Z must be positive"):
        pixel_to_camera_space(960.0, 540.0, -1.0, intrinsics)
