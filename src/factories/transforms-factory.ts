import type { CanvasController } from "@custom-types";

import ApplyBrightness from "@transform/algorithms/apply-brightness";
import ApplyContrast from "@transform/algorithms/apply-contrast";
import MirrorImage from "@transform/algorithms/mirror-image";
import ResizeImage from "@transform/algorithms/resize-image";
import RotateImage from "@transform/algorithms/rotate-image";
import ToGrayScale from "@transform/algorithms/to-gray-scale";
import TranslateImage from "@transform/algorithms/translate-image";
import MeanFilter from "@transform/algorithms/filters/mean-filter";
import GaussianFilter from "@transform/algorithms/filters/gaussian-filter";
import MedianFilter from "@transform/algorithms/filters/median-filter";
import ModeFilter from "@transform/algorithms/filters/mode-filter";
import ThresholFilter from "@transform/algorithms/filters/threshold-filter";
import RobertsBorderDetection from "@transform/algorithms/filters/roberts-border-detection";
import KirschBorderDetection from "@transform/algorithms/filters/kirsch-border-detection";
import RobinsonBorderDetection from "@transform/algorithms/filters/robinson-border-detection";

export function createTransforms(canvasCtrl: CanvasController): typeof transforms {
  const transforms = {
    "apply-brightness": new ApplyBrightness(canvasCtrl),
    "apply-contrast": new ApplyContrast(canvasCtrl),
    "mirror-image": new MirrorImage(canvasCtrl),
    "resize-image": new ResizeImage(canvasCtrl),
    "rotate-image": new RotateImage(canvasCtrl),
    "to-gray-scale": new ToGrayScale(canvasCtrl),
    "translate-image": new TranslateImage(canvasCtrl),
    "mean-filter": new MeanFilter(canvasCtrl),
    "gaussian-filter": new GaussianFilter(canvasCtrl),
    "median-filter": new MedianFilter(canvasCtrl),
    "mode-filter": new ModeFilter(canvasCtrl),
    "threshold-filter": new ThresholFilter(canvasCtrl),
    "roberts-border-detection": new RobertsBorderDetection(canvasCtrl),
    "kirsch-border-detection": new KirschBorderDetection(canvasCtrl),
    "robinson-border-detection": new RobinsonBorderDetection(canvasCtrl),
  }

  return transforms;
}