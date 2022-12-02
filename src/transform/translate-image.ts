import { multiply } from 'mathjs';

import {
  Transform,
} from "@transform/interface";

import { Canvas, PixelPositionMatrix } from '@custom-types';

export default class TranslateImage implements Transform {
  private canvas: Canvas;
  
  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }

  async execute(tx: number, ty: number) {
    const translationMatrix = [
      [1, 0, tx],
      [0, 1, ty],
      [0, 0, 1],
    ];

    const inM = this.canvas.getPixelPositionMatrix(),
      outM = multiply(translationMatrix, inM) as unknown as PixelPositionMatrix;

    const inImg = {
      ...this.canvas.img,
      x: 0,
      y: 0,
    } as typeof this.canvas.img;

    const outImg = {
      ...this.canvas.img,
      width: this.canvas.width,
      height: this.canvas.height,
    } as typeof this.canvas.img;

    const pixelData = this.canvas.getOutputPixelData(inM, outM, inImg, outImg);

    this.canvas.img.x += tx;
    this.canvas.img.y += ty;

    this.canvas.draw(pixelData);
  }
}
