import {
  Transform,
} from "@transform/interface";

import Canvas from "@canvas/index";

export default class ToGrayScale implements Transform {
  private canvas: Canvas;
  
  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }

  async execute() {
    const pixelData = this.canvas.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data;

    for (let i = 0; i < pixelData.length; i += 4) {
      const r = pixelData[i + 0],
        g = pixelData[i + 1],
        b = pixelData[i + 2];

      const avg = (r + g + b) / 3;

      pixelData[i + 0] = avg; // R
      pixelData[i + 1] = avg; // G
      pixelData[i + 2] = avg; // B
    }

    this.canvas.draw(pixelData);
  }
}
