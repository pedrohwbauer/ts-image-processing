import { Filter } from "./abstract-filter";

export default class MeanFilter extends Filter {
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
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ];

    const outRgbaM = this.filterRGBAMatrix(
      inRgbaM,
      mask,
      (productM) => this.sumMatrix(productM) / 9
    );

    const outPixelData = this.getPixelDataFromRGBAMatrix(outRgbaM);

    canvasCtrl.draw(outPixelData);
  }
}
