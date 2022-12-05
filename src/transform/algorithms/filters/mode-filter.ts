import { Filter } from "./abstract-filter";

export default class ModeFilter extends Filter {
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

    const getMatrixMode = (mtx: Uint8ClampedArray[]) => {
      const arr = this.matrixToArray(mtx);

      const occurMap = new Map<number, number>();

      arr.forEach((n) =>
        occurMap.set(n, occurMap.has(n) ? occurMap.get(n)! + 1 : 1)
      );

      let maxOccur = 0;
      let mode = 0;

      occurMap.forEach((occurs, number) => {
        if (occurs > maxOccur) {
          maxOccur = occurs;
          mode = number;
        }
      });

      return mode;
    };

    const mask = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ];

    const outRgbaM = this.filterRGBAMatrix(inRgbaM, mask, (productM) =>
      getMatrixMode(productM)
    );

    const outPixelData = this.getPixelDataFromRGBAMatrix(outRgbaM);

    canvasCtrl.draw(outPixelData);
  }
}
