import type {
  CanvasController,
  PixelPositionMatrix,
  ImagePositionData,
} from "@custom-types";

import { Pivot } from "@transform/enums";

export abstract class Transform {
  protected canvasCtrl?: CanvasController;

  constructor(canvasCtrl?: CanvasController) {
    this.canvasCtrl = canvasCtrl;
  }

  public setCanvasController(canvasCtrl: CanvasController) {
    this.canvasCtrl = canvasCtrl;
  }

  protected getSelfCanvasController(): CanvasController | undefined {
    if (!this.canvasCtrl) throw new Error("Canvas Controller is not set!");

    return this.canvasCtrl;
  }

  public abstract execute(...args: any[]): Promise<void>;

  protected getPixelPositionMatrix(
    pivot: Pivot = Pivot.TopLeft
  ): PixelPositionMatrix {
    const canvasCtrl = this.getSelfCanvasController()!;

    const pixelPositionMatrix = [
      [], // X
      [], // Y
      [], // 1
    ] as PixelPositionMatrix;

    const yInit =
      pivot === Pivot.Center ? -Math.floor(canvasCtrl.img.height / 2) : 0;

    const xInit =
      pivot === Pivot.Center ? -Math.floor(canvasCtrl.img.width / 2) : 0;

    const yEnd =
      pivot === Pivot.Center
        ? Math.ceil(canvasCtrl.img.height / 2)
        : canvasCtrl.img.height;

    const xEnd =
      pivot === Pivot.Center
        ? Math.ceil(canvasCtrl.img.width / 2)
        : canvasCtrl.img.width;

    for (let y = yInit; y < yEnd; y++) {
      for (let x = xInit; x < xEnd; x++) {
        pixelPositionMatrix[0].push(x);
        pixelPositionMatrix[1].push(y);
        pixelPositionMatrix[2].push(1);
      }
    }

    return pixelPositionMatrix;
  }

  protected getOutputPixelDataFromPixelPosition(
    inM: PixelPositionMatrix,
    outM: PixelPositionMatrix,
    inImg: ImagePositionData,
    outImg: ImagePositionData
  ): Uint8ClampedArray {
    const canvasCtrl = this.getSelfCanvasController()!;

    const inPixelData = canvasCtrl.ctx.getImageData(
      canvasCtrl.img.x,
      canvasCtrl.img.y,
      canvasCtrl.img.width,
      canvasCtrl.img.height
    ).data;

    const outPixelData = new Uint8ClampedArray(
      4 * outImg.width * outImg.height
    );

    const size = inImg.width * inImg.height;
    for (let n = 0; n < size; n++) {
      const inX = inImg.x + inM[0][n],
        inY = inImg.y + inM[1][n],
        outX = outImg.x + Math.round(outM[0][n]),
        outY = outImg.y + Math.round(outM[1][n]);

      if (outX >= outImg.width || outY >= outImg.height) continue;

      const inIdx = 4 * (inY * inImg.width + inX);
      const outIdx = 4 * (outY * outImg.width + outX);

      outPixelData[outIdx + 0] = inPixelData[inIdx + 0]; // R
      outPixelData[outIdx + 1] = inPixelData[inIdx + 1]; // G
      outPixelData[outIdx + 2] = inPixelData[inIdx + 2]; // B
      outPixelData[outIdx + 3] = inPixelData[inIdx + 3]; // A
    }

    return outPixelData;
  }
}
