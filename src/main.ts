import { CanvasController } from '@controllers/canvas-controller'
import { createTransforms } from '@factories/transforms-factory';
import { declareButtonActions } from './buttonActions'

const canvasCtrl = new CanvasController(document.querySelector<HTMLCanvasElement>("#canvas")!);
const transforms = createTransforms(canvasCtrl);

document.addEventListener("DOMContentLoaded", function() {
  declareButtonActions(canvasCtrl, transforms);
});
