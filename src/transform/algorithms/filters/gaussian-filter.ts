import { Filter } from "./abstract-filter";

export default class GaussianFilter extends Filter {
  async execute() {
    const canvasCtrl = this.getSelfCanvasController()!;

    const pixelData = canvasCtrl.ctx.getImageData(
      0,
      0,
      canvasCtrl.width,
      canvasCtrl.height
    ).data;

    const inRgbaM = this.getRGBAMatrixFromPixelData(
      pixelData,
      canvasCtrl.width,
      canvasCtrl.height
    );

    const mask = [
      [1, 2, 1],
      [2, 4, 2],
      [1, 2, 1],
    ];

    const outRgbaM = await this.filterRGBAMatrix(
      inRgbaM,
      mask,
      (productM) => this.sumMatrix(productM) / 16
    );

    const outPixelData = this.getPixelDataFromRGBAMatrix(outRgbaM);

    canvasCtrl.draw(outPixelData);
  }
}
