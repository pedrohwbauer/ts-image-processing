import { multiply } from "mathjs";

import {
  Transform,
} from "@transform/interface";

import { Canvas, PixelPositionMatrix } from "@custom-types";

import { Pivot } from "@transform/enums";

export default class RotateImage implements Transform {
  private canvas: Canvas;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }

  public async execute(angle: number) {
    const radians = (angle * Math.PI) / 180;

    const cos = Math.cos(radians),
      sin = Math.sin(radians);

    const rotationMatrix = [
      [cos, -sin, 0],
      [sin, cos, 0],
      [0, 0, 1],
    ];

    const inM = this.canvas.getPixelPositionMatrix(Pivot.Center),
      outM = multiply(rotationMatrix, inM) as unknown as PixelPositionMatrix;

    const inImg = {
      ...this.canvas.img,
      x: Math.floor(this.canvas.img.width / 2),
      y: Math.floor(this.canvas.img.height / 2),
    } as typeof this.canvas.img;

    const outImg = {
      ...inImg,
      width: this.canvas.width,
      height: this.canvas.height,
    } as typeof this.canvas.img;

    const pixelData = this.canvas.getOutputPixelData(inM, outM, inImg, outImg);

    const drawImg = {
      ...outImg,
      x: this.canvas.img.x,
      y: this.canvas.img.y,
    } as typeof this.canvas.img;
    this.canvas.draw(pixelData, drawImg);
  }
}
