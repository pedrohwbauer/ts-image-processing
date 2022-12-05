import { Transform } from "@transform";
import { PixelMatrix, RGBAMatrix } from "@custom-types";

export abstract class Filter extends Transform {
  private getEmptyRGBAMatrix(width: number, height: number): RGBAMatrix {
    const getEmptyPixelMatrix = () =>
      Array(height)
        .fill(null)
        .map(() => new Uint8ClampedArray(width)) as PixelMatrix;

    const rgbaM = [
      getEmptyPixelMatrix(),
      getEmptyPixelMatrix(),
      getEmptyPixelMatrix(),
      getEmptyPixelMatrix(),
    ] as RGBAMatrix;

    return rgbaM;
  }

  protected getRGBAMatrixFromPixelData(
    pixelData: Uint8ClampedArray,
    width: number,
    height: number
  ): RGBAMatrix {
    const rgbaM = this.getEmptyRGBAMatrix(width, height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = 4 * (y * width + x);

        rgbaM[0][y][x] = pixelData[idx + 0]; // R
        rgbaM[1][y][x] = pixelData[idx + 1]; // G
        rgbaM[2][y][x] = pixelData[idx + 2]; // B
        rgbaM[3][y][x] = pixelData[idx + 3]; // A
      }
    }

    return rgbaM;
  }

  protected filterRGBAMatrix(
    inRgbaM: RGBAMatrix,
    mask: number[][],
    filterFunction: (productM: PixelMatrix) => number
  ): RGBAMatrix {
    const mutiplyByMask = (
      pixelMatrix: PixelMatrix,
      x: number,
      y: number,
      mask: number[][]
    ) => {
      const maskHeight = mask.length,
        maskWidth = mask[0].length;

      const productMatrix = Array(maskHeight)
        .fill(null)
        .map(() => new Uint8ClampedArray(maskWidth)) as PixelMatrix;

      for (let i = 0; i < maskHeight; i++) {
        for (let j = 0; j < maskWidth; j++) {
          productMatrix[i][j] = pixelMatrix[y + i][x + j] * mask[i][j];
        }
      }

      return productMatrix;
    };

    const mWidth = inRgbaM[0][0].length,
    mHeight = inRgbaM[0].length;

    const outRgbaM = this.getEmptyRGBAMatrix(mWidth, mHeight);

    for (let y = 1; y < mHeight - 1; y++) {
      for (let x = 1; x < mWidth - 1; x++) {
        inRgbaM.forEach((colorM, colorIdx) => {
          const productM = mutiplyByMask(colorM, x - 1, y - 1, mask);

          const newValue = Math.floor(filterFunction(productM));

          outRgbaM[colorIdx][y][x] = newValue;
        });
      }
    }

    return outRgbaM;
  }

  protected sumMatrix(pixelMatrix: PixelMatrix) {
    return pixelMatrix.reduce(
      (a1, b1) => a1 + b1.reduce((a2, b2) => a2 + b2),
      0
    );
  }

  protected matrixToArray(mtx: Uint8ClampedArray[]): number[] {
    const arr = [] as number[];

    mtx.forEach((row) => arr.push(...row))

    return arr;
  }

  protected getPixelDataFromRGBAMatrix(rgbaM: RGBAMatrix): Uint8ClampedArray {
    const mWidth = rgbaM[0][0].length,
      mHeight = rgbaM[0].length;

    const pixelData = new Uint8ClampedArray(4 * mHeight * mWidth);

    for (let y = 0; y < mHeight; y++) {
      for (let x = 0; x < mWidth; x++) {
        const idx = 4 * (y * mHeight + x);

        pixelData[idx + 0] = rgbaM[0][y][x]; // R
        pixelData[idx + 1] = rgbaM[1][y][x]; // G
        pixelData[idx + 2] = rgbaM[2][y][x]; // B
        pixelData[idx + 3] = rgbaM[3][y][x]; // A
      }
    }

    return pixelData;
  }
}
