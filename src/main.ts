import Canvas from '@canvas'
import { createTransforms } from '@factory/transforms-factory';
import declareCanvasControls from './canvasControls'

const canvas = new Canvas(600,600);
const transforms = createTransforms(canvas);

document.addEventListener("DOMContentLoaded", function() {
  declareCanvasControls(canvas, transforms);
});
