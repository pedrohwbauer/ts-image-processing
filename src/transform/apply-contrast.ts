import { Transform } from "@transform/interface";

import type { Canvas } from "@custom-types";

export default class ApplyContrast implements Transform {
  private canvas: Canvas;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }

  async execute(contrast: number) {
    const pixelData = this.canvas.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    ).data;

    for (let i = 0; i < pixelData.length; i += 4) {
      pixelData[i + 0] *= contrast!; // R
      pixelData[i + 1] *= contrast!; // G
      pixelData[i + 2] *= contrast!; // B
    }

    this.canvas.draw(pixelData);
  }
}
