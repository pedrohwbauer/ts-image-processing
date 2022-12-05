import { Transform } from "@transform";
import { PixelMatrix, RGBAMatrix } from "@custom-types";

export abstract class Morphology extends Transform {
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

  private invertPixels(m: PixelMatrix): PixelMatrix {
    const height = m.length,
      width = m[0].length;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        m[y][x] = 255 - m[y][x];
      }
    }

    return m;
  }

  private dilation(inM: PixelMatrix, intensity: number): PixelMatrix {
    inM = this.invertPixels(inM);

    const height = inM.length,
      width = inM[0].length;

    const outM = Array(height)
      .fill(null)
      .map(() => new Uint8ClampedArray(width));

    debugger;

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const center = inM[y][x] + intensity,
          up = inM[y + 1][x] + intensity,
          down = inM[y - 1][x] + intensity,
          left = inM[y][x - 1] + intensity,
          right = inM[y][x + 1] + intensity;

        const maxVal = Math.max(center, up, down, left, right);

        outM[y][x] = maxVal;
        outM[y + 1][x] = maxVal;
        outM[y - 1][x] = maxVal;
        outM[y][x - 1] = maxVal;
        outM[y][x + 1] = maxVal;
      }
    }

    return this.invertPixels(outM);
  }

  protected dilationRGBA(inRgbaM: RGBAMatrix, intensity: number): RGBAMatrix {
    const outRgbaM = [
      this.dilation(inRgbaM[0], intensity), // R
      this.dilation(inRgbaM[1], intensity), // G
      this.dilation(inRgbaM[2], intensity), // B
      inRgbaM[3], // A
    ] as RGBAMatrix;

    return outRgbaM;
  }

  private erosion(inM: PixelMatrix, intensity: number): PixelMatrix {
    inM = this.invertPixels(inM);

    const height = inM.length,
      width = inM[0].length;

    const outM = Array(height)
      .fill(null)
      .map(() => new Uint8ClampedArray(width));

    // debugger;

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const center = inM[y][x] - intensity,
          up = inM[y + 1][x] - intensity,
          down = inM[y - 1][x] - intensity,
          left = inM[y][x - 1] - intensity,
          right = inM[y][x + 1] - intensity;

        const minVal = Math.min(center, up, down, left, right);

        outM[y][x] = minVal;
        outM[y + 1][x] = minVal;
        outM[y - 1][x] = minVal;
        outM[y][x - 1] = minVal;
        outM[y][x + 1] = minVal;
      }
    }

    return this.invertPixels(outM);
  }

  protected erosionRGBA(inRgbaM: RGBAMatrix, intensity: number): RGBAMatrix {
    const outRgbaM = [
      this.erosion(inRgbaM[0], intensity), // R
      this.erosion(inRgbaM[1], intensity), // G
      this.erosion(inRgbaM[2], intensity), // B
      inRgbaM[3], // A
    ] as RGBAMatrix;

    return outRgbaM;
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
