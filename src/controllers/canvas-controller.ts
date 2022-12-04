import type { PixelPositionMatrix } from "@custom-types";

import { Pivot } from "@transform/enums";

type ImagePositionData = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export class CanvasController {
  public width: number;
  public height: number;
  public ctx: CanvasRenderingContext2D;
  public img: ImagePositionData;

  constructor(htmlCanvas: HTMLCanvasElement) {
    this.width = htmlCanvas.width;
    this.height = htmlCanvas.height;

    this.ctx = htmlCanvas.getContext("2d")!;

    this.img = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }

  public async loadImage(src: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        const htmlImg = new Image() as HTMLImageElement;
        htmlImg.src = src;

        htmlImg.addEventListener("load", () => {
          this.img.width = htmlImg.width;
          this.img.height = htmlImg.height;

          this.ctx.drawImage(htmlImg, this.img.x, this.img.y);

          resolve();
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  public getPixelPositionMatrix(
    pivot: Pivot = Pivot.TopLeft
  ): PixelPositionMatrix {
    const pixelPositionMatrix = [
      [], // X
      [], // Y
      [], // 1
    ] as PixelPositionMatrix;

    const yInit = pivot === Pivot.Center ? -Math.floor(this.img.height / 2) : 0;
    const xInit = pivot === Pivot.Center ? -Math.floor(this.img.width / 2) : 0;
    const yEnd =
      pivot === Pivot.Center ? Math.ceil(this.img.height / 2) : this.img.height;
    const xEnd =
      pivot === Pivot.Center ? Math.ceil(this.img.width / 2) : this.img.width;

    for (let y = yInit; y < yEnd; y++) {
      for (let x = xInit; x < xEnd; x++) {
        pixelPositionMatrix[0].push(x);
        pixelPositionMatrix[1].push(y);
        pixelPositionMatrix[2].push(1);
      }
    }

    return pixelPositionMatrix;
  }

  public getOutputPixelData(
    inM: PixelPositionMatrix,
    outM: PixelPositionMatrix,
    inImg: ImagePositionData,
    outImg: ImagePositionData
  ): Uint8ClampedArray {
    const inPixelData = this.ctx.getImageData(
        this.img.x,
        this.img.y,
        this.img.width,
        this.img.height
      ).data,
      outPixelData = new Uint8ClampedArray(4 * outImg.width * outImg.height);

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

  public draw(pixelData: Uint8ClampedArray, drawImg?: ImagePositionData): void {
    if (!drawImg)
      drawImg = {
        x: 0,
        y: 0,
        width: this.width,
        height: this.height,
      };

    const imageData = new ImageData(pixelData, drawImg.width, drawImg.height);

    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.putImageData(imageData, drawImg.x, drawImg.y);
  }
}
