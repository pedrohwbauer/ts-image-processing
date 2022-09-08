import { multiply } from 'mathjs';

type X = number;
type Y = number;
type PixelPositionMatrix = [ X[],
                             Y[],
                             1[] ];

type Tx = number;
type Ty = number;
type TranslationMatrix = [ [  1,  0, Tx ],
                           [  0,  1, Ty ],
                           [  0,  0,  1 ] ];

type Sx = number;
type Sy = number;
type ScaleMatrix = [ [ Sx,  0,  0 ],
                     [  0, Sy,  0 ],
                     [  0,  0,  1 ] ];

type Cos = number;
type Sin = number;
type RotationMatrix = [ [ Cos, Sin, 0 ],
                        [ Sin, Cos, 0 ],
                        [   0,   0, 1 ] ];

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

  async #getPixelPositionMatrix(): Promise<PixelPositionMatrix> {
    const width = this.#canvas.width,
          height = this.#canvas.height;

    const pixelPositionMatrix: PixelPositionMatrix = [
      [], // X
      [], // Y
      []  // 1
    ];

    for(let y = 0; y < height; y++) {
      for(let x = 0; x < width; x++) {
        pixelPositionMatrix[0].push(x)
        pixelPositionMatrix[1].push(y)
        pixelPositionMatrix[2].push(1)
      }
    }

    return pixelPositionMatrix;
  }

  async #getOutputPixelData(inM: PixelPositionMatrix, outM: PixelPositionMatrix): Promise<Uint8ClampedArray> {
    const width = this.#canvas.width,
          height = this.#canvas.height,
          size = width*height;

    const inPixelData = this.ctx.getImageData(0, 0, width, height).data,
          outPixelData = new Uint8ClampedArray(4*size);

    for(let n = 0; n < size; n++) {
      const inX = inM[0][n],
            inY = inM[1][n],
            outX = outM[0][n],
            outY = outM[1][n];

      if(outX >= width || outY >= height)
        continue;

      const inIdx = 4 * (inY * width + inX);
      const outIdx = Math.round(4 * (outY * width + outX));
      
      outPixelData[outIdx + 0] = inPixelData[inIdx + 0]; // R
      outPixelData[outIdx + 1] = inPixelData[inIdx + 1]; // G
      outPixelData[outIdx + 2] = inPixelData[inIdx + 2]; // B
      outPixelData[outIdx + 3] = inPixelData[inIdx + 3]; // A
    }

    return outPixelData;
  }

  async #draw(pixelData: Uint8ClampedArray) {
    const width = this.#canvas.width,
          height = this.#canvas.height;

    const imageData = new ImageData(pixelData, width, height);

    this.ctx.putImageData(imageData, 0, 0);
  }
  
  async toGrayScale(): Promise<void> {
    const width = this.#canvas.width,
      height = this.#canvas.height;

    const pixelData = this.ctx.getImageData(0, 0, width, height).data;

    for (let i = 0; i < pixelData.length; i += 4) {
        const r = pixelData[i + 0],
              g = pixelData[i + 1],
              b = pixelData[i + 2];

        const avg = (r + g + b) / 3;

        pixelData[i + 0] = avg;
        pixelData[i + 1] = avg;
        pixelData[i + 2] = avg;
    }

    this.#draw(pixelData);
  }

  async translateImage(tx: Tx, ty: Ty) {
    const tM: TranslationMatrix = [
      [  1,  0, tx ],
      [  0,  1, ty ],
      [  0,  0,  1 ]
    ];

    const inM = await this.#getPixelPositionMatrix(),
          outM = multiply(tM, inM) as PixelPositionMatrix;

    const pixelData = await this.#getOutputPixelData(inM, outM);

    this.#draw(pixelData);
  }

  //OBS: Gera imagens duplicadas caso scala < 1;
  async resizeImage(sx: Sx, sy: Sy) {
    const sM: ScaleMatrix = [
      [ sx,  0,  0 ],
      [  0, sy,  0 ],
      [  0,  0,  1 ]
    ];

    const inM = await this.#getPixelPositionMatrix(),
          outM = multiply(sM, inM) as PixelPositionMatrix;

    const pixelData = await this.#getOutputPixelData(inM, outM);

    this.#draw(pixelData);
  }
 
  //OBS: Funciona somente com angulos retos;
  async rotateImage(angle: number) {
    const radians = angle * Math.PI / 180
    
    const cos = Math.cos(radians),
          sin = Math.sin(radians);

    const rM: RotationMatrix = [
      [ cos, -sin, 0 ],
      [ sin,  cos, 0 ],
      [   0,    0, 1 ]
    ];

    const inM = await this.#getPixelPositionMatrix(),
          outM = multiply(rM, inM) as PixelPositionMatrix;

    const pixelData = await this.#getOutputPixelData(inM, outM);

    this.#draw(pixelData);
  }

}