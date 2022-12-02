import { multiply } from "mathjs";

import { Transform } from "@transform/interface";

import { Canvas, PixelPositionMatrix } from "@custom-types";

export default class resizeImage implements Transform {
  private canvas: Canvas;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }
  public async execute(sx: number, sy: number) {
    const scaleMatrix = [
      [sx, 0, 0],
      [0, sy, 0],
      [0, 0, 1],
    ];

    const inM = this.canvas.getPixelPositionMatrix(),
      outM = multiply(scaleMatrix, inM) as unknown as PixelPositionMatrix;

    const inImg = {
      ...this.canvas.img,
      x: 0,
      y: 0,
    } as typeof this.canvas.img;

    const outImg = {
      ...inImg,
      width: Math.round(sx! * this.canvas.img.width),
      height: Math.round(sy! * this.canvas.img.height),
    } as typeof this.canvas.img;

    const pixelData = this.canvas.getOutputPixelData(inM, outM, inImg, outImg);

    this.canvas.img.width = outImg.width;
    this.canvas.img.height = outImg.height;

    const drawImg = { ...this.canvas.img } as typeof this.canvas.img;
    this.canvas.draw(pixelData, drawImg);
  }
}
