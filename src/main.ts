import Canvas from './Canvas'

const canvas = new Canvas(600,300);

canvas.loadImage("/Lena.jpg")
  // .then(() => canvas.toGrayScale())
  .then(() => canvas.translateImage(50,20))
  // .then(() => canvas.rotateImage(270))
  // .then(() => canvas.resizeImage(0.5,0.5))
  // .then(() => canvas.resizeImage(2,2))
  .then(() => canvas.mirrorImage(Canvas.Mirror.Horizontal))
  // .then(() => canvas.applyContrast(2))
  // .then(() => canvas.applyBrightness(100))


