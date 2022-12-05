import type { ImagePositionData } from "@custom-types";

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
