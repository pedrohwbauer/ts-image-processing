import type { PixelPositionMatrix, TranslationMatrix, ScaleMatrix, RotationMatrix, MirrorMatrix } from './matrix'
import { multiply } from 'mathjs';

export enum Mirror {
  Horizontal,
  Vertical
}

export default class Canvas {
  #canvas: HTMLCanvasElement;
  #ctx: CanvasRenderingContext2D;
  #img: HTMLImageElement;

  constructor(width: number, height: number) {
    this.#canvas = document.createElement("canvas");
    this.#canvas.width = width;
    this.#canvas.height = height;

    const app = document.querySelector<HTMLElement>("#app");
    app!.appendChild(this.#canvas);

    this.#ctx = this.#canvas.getContext("2d")!;

    this.#img = new Image();
  }

  async loadImage(src: string): Promise<void> {
    return new Promise<void>((resolve) => {
      this.#img = new Image();
      this.#img.src = src;
      this.#img.addEventListener("load", () => {
        this.#ctx.drawImage(this.#img, 0, 0);
        resolve();
      });
    });
  }

  #getPixelPositionMatrix(): PixelPositionMatrix {
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

  #getOutputPixelData(inM: PixelPositionMatrix, outM: PixelPositionMatrix): Uint8ClampedArray {
    const width = this.#canvas.width,
          height = this.#canvas.height,
          size = width*height;

    const inPixelData = this.#ctx.getImageData(0, 0, width, height).data,
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

  #draw(pixelData: Uint8ClampedArray): void {
    const width = this.#canvas.width,
          height = this.#canvas.height;

    const imageData = new ImageData(pixelData, width, height);

    this.#ctx.putImageData(imageData, 0, 0);
  }
  
  async toGrayScale(): Promise<void> {
    const width = this.#canvas.width,
      height = this.#canvas.height;

    const pixelData = this.#ctx.getImageData(0, 0, width, height).data;

    for (let i = 0; i < pixelData.length; i += 4) {
        const r = pixelData[i + 0],
              g = pixelData[i + 1],
              b = pixelData[i + 2];

        const avg = (r + g + b) / 3;

        pixelData[i + 0] = avg; // R
        pixelData[i + 1] = avg; // G
        pixelData[i + 2] = avg; // B
    }

    this.#draw(pixelData);
  }

  async applyContrast(contrast: number): Promise<void> {
    const width = this.#canvas.width,
      height = this.#canvas.height;

    const pixelData = this.#ctx.getImageData(0, 0, width, height).data;

    for (let i = 0; i < pixelData.length; i += 4) {
        
        pixelData[i + 0] *= contrast; // R
        pixelData[i + 1] *= contrast; // G
        pixelData[i + 2] *= contrast; // B
    }

    this.#draw(pixelData);
  }

  async applyBrightness(brightness: number): Promise<void> {
    const width = this.#canvas.width,
      height = this.#canvas.height;

    const pixelData = this.#ctx.getImageData(0, 0, width, height).data;

    for (let i = 0; i < pixelData.length; i += 4) {
        
        pixelData[i + 0] += brightness; // R
        pixelData[i + 1] += brightness; // G
        pixelData[i + 2] += brightness; // B
    }

    this.#draw(pixelData);
  }

  async translateImage(tx: number, ty: number): Promise<void> {
    const tM: TranslationMatrix = [
      [  1,  0, tx ],
      [  0,  1, ty ],
      [  0,  0,  1 ]
    ];

    const inM = this.#getPixelPositionMatrix(),
          outM = multiply(tM, inM) as PixelPositionMatrix;

    const pixelData = this.#getOutputPixelData(inM, outM);

    this.#draw(pixelData);
  }

  //OBS: Gera imagens duplicadas caso scala < 1;
  async resizeImage(sx: number, sy: number): Promise<void> {
    const sM: ScaleMatrix = [
      [ sx,  0,  0 ],
      [  0, sy,  0 ],
      [  0,  0,  1 ]
    ];

    const inM = this.#getPixelPositionMatrix(),
          outM = multiply(sM, inM) as PixelPositionMatrix;

    const pixelData = this.#getOutputPixelData(inM, outM);

    this.#draw(pixelData);
  }
 
  //OBS: Funciona somente com angulos retos;
  async rotateImage(angle: number): Promise<void> {
    const radians = angle * Math.PI / 180
    
    const cos = Math.cos(radians),
          sin = Math.sin(radians);

    const rM: RotationMatrix = [
      [ cos, -sin, 0 ],
      [ sin,  cos, 0 ],
      [   0,    0, 1 ]
    ];

    const inM = this.#getPixelPositionMatrix(),
          outM = multiply(rM, inM) as PixelPositionMatrix;

    const pixelData = this.#getOutputPixelData(inM, outM);

    this.#draw(pixelData);
  }

  async mirrorImage(mirror: Mirror): Promise<void> {
    const xM = mirror === Mirror.Horizontal ? -1 : 1,
          yM = mirror === Mirror.Vertical ? -1 : 1;
    
    const mM: MirrorMatrix = [
      [ xM,  0,  0 ],
      [  0, yM,  0 ],
      [  0,  0,  1 ]
    ];

    const inM = this.#getPixelPositionMatrix(),
          outM = multiply(mM, inM) as PixelPositionMatrix;

    const pixelData = this.#getOutputPixelData(inM, outM);
    
    this.#draw(pixelData);
  }

}