import { multiply } from "mathjs";

import { Transform } from "@transform/interface";

import type { PixelPositionMatrix, Canvas } from "@custom-types";

import { Mirror } from "@transform/enums";

export default class MirrorImage implements Transform {
  private canvas: Canvas;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }

  public async execute(direction: Mirror) {
    const xM = direction === Mirror.Horizontal ? -1 : 1,
      yM = direction === Mirror.Vertical ? -1 : 1;

    const mirrorMatrix = [
      [xM, 0, 0],
      [0, yM, 0],
      [0, 0, 1],
    ];

    const inM = this.canvas.getPixelPositionMatrix(),
      outM = multiply(mirrorMatrix, inM) as unknown as PixelPositionMatrix;

    const inImg = {
      ...this.canvas.img,
      x: 0,
      y: 0,
    } as typeof this.canvas.img;

    const outImg = {
      ...this.canvas.img,
      x: direction === Mirror.Horizontal ? this.canvas.img.width - 1 : 0,
      y: direction === Mirror.Vertical ? this.canvas.img.height - 1 : 0,
    } as typeof this.canvas.img;

    const pixelData = this.canvas.getOutputPixelData(inM, outM, inImg, outImg);

    const drawImg = { ...this.canvas.img } as typeof this.canvas.img;
    this.canvas.draw(pixelData, drawImg);
  }
}
