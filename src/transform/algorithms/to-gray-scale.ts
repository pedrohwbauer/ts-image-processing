import { Transform } from "@transform";

export default class ToGrayScale extends Transform {
  async execute(canvasCtrl = this.canvasCtrl) {
    const pixelData = canvasCtrl.ctx.getImageData(
      0,
      0,
      canvasCtrl.width,
      canvasCtrl.height
    ).data;

    for (let i = 0; i < pixelData.length; i += 4) {
      const r = pixelData[i + 0],
        g = pixelData[i + 1],
        b = pixelData[i + 2];

      const avg = (r + g + b) / 3;

      pixelData[i + 0] = avg; // R
      pixelData[i + 1] = avg; // G
      pixelData[i + 2] = avg; // B
    }

    canvasCtrl.draw(pixelData);
  }
}
