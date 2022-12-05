import { Filter } from "@transform/algorithms/filters/abstract-filter";

export default class ThresholdFilter extends Filter {
  async execute(threshold: number) {
    const canvasCtrl = this.getSelfCanvasController()!;

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

      pixelData[i + 0] = r > threshold ? 255 : 0; // R
      pixelData[i + 1] = g > threshold ? 255 : 0; // G
      pixelData[i + 2] = b > threshold ? 255 : 0; // B
      pixelData[i + 3] = 255; // A
    }

    canvasCtrl.draw(pixelData);
  }
}
