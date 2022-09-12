import Canvas, { Mirror } from './Canvas'

const canvas = new Canvas(600,600);

canvas.loadImage("/Lena.jpg")
  // .then(() => canvas.toGrayScale())
  // .then(() => canvas.translateImage(50,20))
  // .then(() => canvas.rotateImage(90))
  .then(() => canvas.resizeImage(3,3))
  // .then(() => canvas.mirrorImage(Mirror.Horizontal))
  // .then(() => canvas.applyContrast(1.5))
  // .then(() => canvas.applyBrightness(100))


