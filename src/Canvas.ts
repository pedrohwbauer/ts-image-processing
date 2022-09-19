import type { PixelPositionMatrix, TranslationMatrix, ScaleMatrix, RotationMatrix, MirrorMatrix } from './matrix'
import { multiply } from 'mathjs';

interface CanvasImage {
  x: number;
  y: number;
  width: number;
  height: number;
}

enum Mirror {
  Horizontal,
  Vertical
}

export default class Canvas {
  public static readonly Mirror = Mirror;

  public width: number;
  public height: number;
  private ctx: CanvasRenderingContext2D;
  private img: CanvasImage;

  constructor(width: number, height: number) {
    const htmlCanvas = document.createElement("canvas") as HTMLCanvasElement;

    this.width = htmlCanvas.width = width;
    this.height = htmlCanvas.height = height;

    const app = document.querySelector<HTMLElement>("#app")!;
    app.appendChild(htmlCanvas);

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
          this.img.width = htmlImg.width
          this.img.height = htmlImg.height
          
          this.ctx.drawImage(htmlImg, this.img.x, this.img.y);

          resolve();
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  private getPixelPositionMatrix(): PixelPositionMatrix {
    const pixelPositionMatrix: PixelPositionMatrix = [
      [], // X
      [], // Y
      []  // 1
    ];

    for(let y = 0; y < this.img.height; y++) {
      for(let x = 0; x < this.img.width; x++) {
        pixelPositionMatrix[0].push(x)
        pixelPositionMatrix[1].push(y)
        pixelPositionMatrix[2].push(1)
      }
    }

    return pixelPositionMatrix;
  }

  private getOutputPixelData(inM: PixelPositionMatrix, outM: PixelPositionMatrix): Uint8ClampedArray {
    const size = this.img.width*this.img.height;

    const inPixelData = this.ctx.getImageData(this.img.x, this.img.y, this.img.width, this.img.height).data,
          outPixelData = new Uint8ClampedArray(4*this.width*this.height);

    for(let n = 0; n < size; n++) {
      const inX = inM[0][n],
            inY = inM[1][n],
            outX = this.img.x + Math.round(outM[0][n]),
            outY = this.img.y + Math.round(outM[1][n]);

      if(outX >= this.width || outY >= this.height)
        continue;

      const inIdx = 4 * (inY * this.img.width + inX);
      const outIdx = 4 * (outY * this.width + outX);
      
      outPixelData[outIdx + 0] = inPixelData[inIdx + 0]; // R
      outPixelData[outIdx + 1] = inPixelData[inIdx + 1]; // G
      outPixelData[outIdx + 2] = inPixelData[inIdx + 2]; // B
      outPixelData[outIdx + 3] = inPixelData[inIdx + 3]; // A
    }

    return outPixelData;
  }

  private draw(pixelData: Uint8ClampedArray): void {
    this.ctx.clearRect(0,0,this.width,this.height);

    const imageData = new ImageData(pixelData, this.width, this.height);

    this.ctx.putImageData(imageData, 0, 0);
  }
  
  public async toGrayScale(): Promise<void> {
    const pixelData = this.ctx.getImageData(0, 0, this.width, this.height).data;

    for (let i = 0; i < pixelData.length; i += 4) {
        const r = pixelData[i + 0],
              g = pixelData[i + 1],
              b = pixelData[i + 2];

        const avg = (r + g + b) / 3;

        pixelData[i + 0] = avg; // R
        pixelData[i + 1] = avg; // G
        pixelData[i + 2] = avg; // B
    }

    this.draw(pixelData);
  }

  public async applyContrast(contrast: number): Promise<void> {
    const pixelData = this.ctx.getImageData(0, 0, this.width, this.height).data;

    for (let i = 0; i < pixelData.length; i += 4) {
        
        pixelData[i + 0] *= contrast; // R
        pixelData[i + 1] *= contrast; // G
        pixelData[i + 2] *= contrast; // B
    }

    this.draw(pixelData);
  }

  public async applyBrightness(brightness: number): Promise<void> {
    const pixelData = this.ctx.getImageData(0, 0, this.width, this.height).data;

    for (let i = 0; i < pixelData.length; i += 4) {
        
        pixelData[i + 0] += brightness; // R
        pixelData[i + 1] += brightness; // G
        pixelData[i + 2] += brightness; // B
    }

    this.draw(pixelData);
  }

  public async translateImage(tx: number, ty: number): Promise<void> {
    const tM: TranslationMatrix = [
      [  1,  0, tx ],
      [  0,  1, ty ],
      [  0,  0,  1 ]
    ];

    const inM = this.getPixelPositionMatrix(),
          outM = multiply(tM, inM) as PixelPositionMatrix;

    const pixelData = this.getOutputPixelData(inM, outM);

    this.img.x += tx;
    this.img.y += ty;

    this.draw(pixelData);
  }

  public async resizeImage(sx: number, sy: number): Promise<void> {
    const sM: ScaleMatrix = [
      [ sx,  0,  0 ],
      [  0, sy,  0 ],
      [  0,  0,  1 ]
    ];

    const inM = this.getPixelPositionMatrix(),
          outM = multiply(sM, inM) as PixelPositionMatrix;

    const pixelData = this.getOutputPixelData(inM, outM);

    this.img.width = Math.round(sx*this.img.width)
    this.img.height = Math.round(sy*this.img.height)

    this.draw(pixelData);
  }
 
  public async rotateImage(angle: number): Promise<void> {
    const radians = angle * Math.PI / 180;
    
    const cos = Math.cos(radians),
          sin = Math.sin(radians);

    const rM: RotationMatrix = [
      [ cos, -sin, 0 ],
      [ sin,  cos, 0 ],
      [   0,    0, 1 ]
    ];

    const inM = this.getPixelPositionMatrix(),
          outM = multiply(rM, inM) as PixelPositionMatrix;

    const pixelData = this.getOutputPixelData(inM, outM);

    this.draw(pixelData);
  }

  public async mirrorImage(mirror: Mirror): Promise<void> {
    const xM = mirror === Mirror.Horizontal ? -1 : 1,
          yM = mirror === Mirror.Vertical ? -1 : 1;
    
    const mM: MirrorMatrix = [
      [ xM,  0,  0 ],
      [  0, yM,  0 ],
      [  0,  0,  1 ]
    ];

    const inM = this.getPixelPositionMatrix(),
          outM = multiply(mM, inM) as PixelPositionMatrix;

    const pixelData = this.getOutputPixelData(inM, outM);
    
    this.draw(pixelData);
  }

}