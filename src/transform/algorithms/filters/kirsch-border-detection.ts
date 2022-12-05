import { Filter } from "./abstract-filter";

export default class KirschBorderDetection extends Filter {
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
        [5, -3, -3],
        [5, 0, -3],
        [5, -3, -3],
      ],
      [
        // 1
        [-3, -3, -3],
        [5, 0, -3],
        [5, 5, -3],
      ],
      [
        // 2
        [-3, -3, -3],
        [-3, 0, -3],
        [5, 5, 5],
      ],
      [
        // 3
        [-3, -3, -3],
        [-3, 0, 5],
        [-3, 5, 5],
      ],
      [
        // 4
        [-3, -3, 5],
        [-3, 0, 5],
        [-3, -3, 5],
      ],
      [
        // 5
        [-3, 5, 5],
        [-3, 0, 5],
        [-3, -3, -3],
      ],
      [
        // 6
        [5, 5, 5],
        [-3, 0, -3],
        [-3, -3, -3],
      ],
      [
        // 7
        [5, 5, -3],
        [5, 0, -3],
        [-3, -3, -3],
      ],
    ];

    const rgbaGs = await this.getRGBAGradientsFromRGBAMatrix(inRgbaM, masks);

    const outPixelData = await this.getPixelDataFromRGBAGradients(
      rgbaGs,
      async (gs) => (Math.max(...gs) > threshold ? 255 : 0)
    );

    canvasCtrl.draw(outPixelData);
  }
}
