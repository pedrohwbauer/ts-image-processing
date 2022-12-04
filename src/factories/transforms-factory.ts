import { CanvasController } from "@controllers/canvas-controller";

import ApplyBrightness from "@transform/algorithms/apply-brightness";
import ApplyContrast from "@transform/algorithms/apply-contrast";
import MirrorImage from "@transform/algorithms/mirror-image";
import ResizeImage from "@transform/algorithms/resize-image";
import RotateImage from "@transform/algorithms/rotate-image";
import ToGrayScale from "@transform/algorithms/to-gray-scale";
import TranslateImage from "@transform/algorithms/translate-image";

export function createTransforms(canvasCtrl: CanvasController): typeof transforms {
  const transforms = {
    "apply-brightness": new ApplyBrightness(canvasCtrl),
    "apply-contrast": new ApplyContrast(canvasCtrl),
    "mirror-image": new MirrorImage(canvasCtrl),
    "resize-image": new ResizeImage(canvasCtrl),
    "rotate-image": new RotateImage(canvasCtrl),
    "to-gray-scale": new ToGrayScale(canvasCtrl),
    "translate-image": new TranslateImage(canvasCtrl),
  }

  return transforms;
}