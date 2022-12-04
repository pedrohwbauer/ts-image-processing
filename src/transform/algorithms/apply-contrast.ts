import { Transform } from "@transform";

export default class ApplyContrast extends Transform {
  async execute(contrast: number, canvasCtrl = this.canvasCtrl) {
    const pixelData = canvasCtrl.ctx.getImageData(
      0,
      0,
      canvasCtrl.width,
      canvasCtrl.height
    ).data;

    for (let i = 0; i < pixelData.length; i += 4) {
      pixelData[i + 0] *= contrast; // R
      pixelData[i + 1] *= contrast; // G
      pixelData[i + 2] *= contrast; // B
    }

    canvasCtrl.draw(pixelData);
  }
}
