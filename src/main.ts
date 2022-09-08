import Canvas from './Canvas'

const canvas = new Canvas(600,600);

canvas.loadImage("/Lena.jpg")
  .then(() => canvas.toGrayScale())
  .then(() => canvas.translateImage(50,20))
  .then(() => canvas.rotateImage(90))
  .then(() => canvas.resizeImage(0.5,0.5))

