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

    const getMatrixMedian = (mtx: Uint8ClampedArray[]) => {
      const arr = this.matrixToArray(mtx);

      arr.sort((a, b) => a - b);

      return arr[Math.floor((arr.length - 1) / 2)];
    };

    const mask = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ];

    const outRgbaM = this.filterRGBAMatrix(
      inRgbaM,
      mask,
      (productM) => getMatrixMedian(productM)
    );

    const outPixelData = this.getPixelDataFromRGBAMatrix(outRgbaM);

    canvasCtrl.draw(outPixelData);
  }
}
