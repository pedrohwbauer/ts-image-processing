import { Filter } from "./abstract-filter";

export default class RobinsonBorderDetection extends Filter {
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

    const masks = [
      [
        // 0
        [1, 0, -1],
        [2, 0, -2],
        [1, 0, -1],
      ],
      [
        // 1
        [0, -1, -2],
        [1, 0, -1],
        [2, 1, 0],
      ],
      [
        // 2
        [-1, -2, -1],
        [0, 0, 0],
        [1, 2, 1],
      ],
      [
        // 3
        [-2, -1, 0],
        [-1, 0, 1],
        [0, 1, 2],
      ],
      [
        // 4
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1],
      ],
      [
        // 5
        [0, 1, 2],
        [-1, 0, 1],
        [-2, -1, 0],
      ],
      [
        // 6
        [1, 2, 1],
        [0, 0, 0],
        [-1, -2, -1],
      ],
      [
        // 7
        [2, 1, 0],
        [1, 0, -1],
        [0, -1, -2],
      ],
    ];

    const rgbaGs = await this.getRGBAGradientsFromRGBAMatrix(inRgbaM, masks);

    const outPixelData = await this.getPixelDataFromRGBAGradients(rgbaGs, async (gs) =>
      Math.max(...gs) > threshold ? 255 : 0
    );

    canvasCtrl.draw(outPixelData);
  }
}
