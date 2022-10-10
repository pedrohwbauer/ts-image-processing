import Canvas from './Canvas'
import declareCanvasControls from './canvasControls'

const canvas = new Canvas(600,600);

document.addEventListener("DOMContentLoaded", function() {
  declareCanvasControls(canvas);
});
