import Canvas from "@canvas";

import ApplyBrightness from "@transform/apply-brightness";
import ApplyContrast from "@transform/apply-contrast";
import MirrorImage from "@transform/mirror-image";
import ResizeImage from "@transform/resize-image";
import RotateImage from "@transform/rotate-image";
import ToGrayScale from "@transform/to-gray-scale";
import TranslateImage from "@transform/translate-image";

export function createTransforms(canvas: Canvas): typeof transforms {
  const transforms = {
    "apply-brightness": new ApplyBrightness(canvas),
    "apply-contrast": new ApplyContrast(canvas),
    "mirror-image": new MirrorImage(canvas),
    "resize-image": new ResizeImage(canvas),
    "rotate-image": new RotateImage(canvas),
    "to-gray-scale": new ToGrayScale(canvas),
    "translate-image": new TranslateImage(canvas),
  }

  return transforms;
}