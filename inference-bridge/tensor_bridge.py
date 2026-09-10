import cv2
import numpy as np
from typing import Tuple


def preprocess_frame(
    raw_image: np.ndarray, 
    target_size: Tuple[int, int] = (640, 640),
    is_rgba: bool = True
) -> np.ndarray:
    """
    Converts a raw camera image frame (RGBA32 or BGR) into normalized NCHW float32 tensor for YOLOv8.
    
    Args:
        raw_image: Numpy array of input frame. Shape (H, W, 4) if RGBA, or (H, W, 3) if BGR/RGB.
        target_size: (width, height) tuple for YOLOv8 input resizing. Default (640, 640).
        is_rgba: True if frame format is RGBA32 from camera stream.

    Returns:
        Numpy array of shape (1, 3, target_size[1], target_size[0]) in float32 normalized range [0.0, 1.0].
    """
    if raw_image is None or not isinstance(raw_image, np.ndarray) or raw_image.size == 0:
        raise ValueError("Invalid raw image input provided to tensor bridge.")

    # Convert color space to RGB
    if is_rgba and raw_image.ndim == 3 and raw_image.shape[2] == 4:
        rgb_img = cv2.cvtColor(raw_image, cv2.COLOR_RGBA2RGB)
    elif raw_image.ndim == 3 and raw_image.shape[2] == 3:
        rgb_img = cv2.cvtColor(raw_image, cv2.COLOR_BGR2RGB)
    elif raw_image.ndim == 2:
        rgb_img = cv2.cvtColor(raw_image, cv2.COLOR_GRAY2RGB)
    else:
        rgb_img = raw_image

    # Resize to target resolution
    resized = cv2.resize(rgb_img, target_size, interpolation=cv2.INTER_LINEAR)

    # Normalize to [0, 1] float32 and transpose HWC -> CHW -> NCHW
    normalized = resized.astype(np.float32) / 255.0
    chw = np.transpose(normalized, (2, 0, 1))
    nchw = np.expand_dims(chw, axis=0)

    return nchw
