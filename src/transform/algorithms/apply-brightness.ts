import { Transform } from "@transform";

export default class ApplyBrightness extends Transform {
  async execute(brightness: number) {
    const canvasCtrl = this.getSelfCanvasController()!;
    
    const pixelData = canvasCtrl.ctx.getImageData(
      0,
      0,
      canvasCtrl.width,
      canvasCtrl.height
    ).data;

    for (let i = 0; i < pixelData.length; i += 4) {
      pixelData[i + 0] += brightness; // R
      pixelData[i + 1] += brightness; // G
      pixelData[i + 2] += brightness; // B
    }

    canvasCtrl.draw(pixelData);
  }
}
