type Pixel = {
  r: number;
  g: number;
  b: number;
  a: number;
};

type PixelMatrix = Pixel[][];

export default class Canvas {
  #canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  img: HTMLImageElement;

  constructor(width: number, height: number) {
    this.#canvas = document.createElement("canvas");
    this.#canvas.width = width;
    this.#canvas.height = height;

    const app = document.querySelector<HTMLElement>("#app");
    app!.appendChild(this.#canvas);

    this.ctx = this.#canvas.getContext("2d")!;

    this.img = new Image();
  }

  async loadImage(src: string): Promise<void> {
    return new Promise<void>((resolve) => {
      this.img = new Image();
      this.img.src = src;
      this.img.addEventListener("load", () => {
        this.ctx.drawImage(this.img, 0, 0);
        resolve();
      });
    });
  }

  async #getPixelMatrix(): Promise<PixelMatrix> {
    const width = this.#canvas.width,
      height = this.#canvas.height;

    const imageData = this.ctx.getImageData(0, 0, width, height);
    const pixelData = imageData.data;

    const pixelMatrix: PixelMatrix = [];

    for (let x = 0; x < width; x++) {
      pixelMatrix.push([]);

      for (let y = 0; y < height; y++) {
        const i = 4 * (x * height + y);

        const pixel: Pixel = {
          r: pixelData[i + 0],
          g: pixelData[i + 1],
          b: pixelData[i + 2],
          a: pixelData[i + 3],
        };

        pixelMatrix[x].push(pixel);
      }
    }

    return pixelMatrix;
  }

  async toGrayScale(): Promise<void> {
    const width = this.#canvas.width,
      height = this.#canvas.height;

    const pixelMatrix = await this.#getPixelMatrix();

    const pixelData = new Uint8ClampedArray(4 * width * height);

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const pixel = pixelMatrix[x][y];

        const avg = (pixel.r + pixel.g + pixel.b) / 3;

        const i = 4 * (x * height + y);

        pixelData[i + 0] = avg;
        pixelData[i + 1] = avg;
        pixelData[i + 2] = avg;
        pixelData[i + 3] = pixel.a;
      }
    }

    const imageData = new ImageData(pixelData, width, height);

    this.ctx.putImageData(imageData, 0, 0);
  }
}
