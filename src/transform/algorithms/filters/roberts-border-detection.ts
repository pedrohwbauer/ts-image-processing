import { Filter } from "./abstract-filter";

export default class RobertsBorderDetection extends Filter {
  async execute(threshold: number) {
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

    const xKernel = [
      [0, 0, 0],
      [0, -1, 0],
      [0, 0, 1],
    ];

    const yKernel = [
      [0, 0, 0],
      [0, 0, -1],
      [0, 1, 0],
    ];

    const masks = [xKernel, yKernel];

    const rgbaGs = await this.getRGBAGradientsFromRGBAMatrix(inRgbaM, masks);

    const outPixelData = await this.getPixelDataFromRGBAGradients(
      rgbaGs,
      async ([gx, gy]) => {
        const g = Math.sqrt(gx ** 2 + gy ** 2);

        return g > threshold ? 255 : 0;
      }
    );

    canvasCtrl.draw(outPixelData);
  }
}
