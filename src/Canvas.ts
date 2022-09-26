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

enum Pivot {
  TopLeft,
  Center,
}

export default class Canvas {
  public static readonly Mirror = Mirror;
  public static readonly Pivot = Pivot;

  public width: number;
  public height: number;
  private ctx: CanvasRenderingContext2D;
  private img: CanvasImage;

  constructor(width: number, height: number) {
    const htmlCanvas = document.querySelector<HTMLCanvasElement>("#canvas")!;

    this.width = htmlCanvas.width = width;
    this.height = htmlCanvas.height = height;

    // const app = document.querySelector<HTMLElement>("#app")!;
    // app.appendChild(htmlCanvas);

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

  private getPixelPositionMatrix(pivot: Pivot = Pivot.TopLeft): PixelPositionMatrix {
    const pixelPositionMatrix: PixelPositionMatrix = [
      [], // X
      [], // Y
      []  // 1
    ];

    const yInit = pivot === Pivot.Center ? -Math.floor(this.img.height/2) : 0;
    const xInit = pivot === Pivot.Center ? -Math.floor(this.img.width/2) : 0;
    const yEnd = pivot === Pivot.Center ? Math.ceil(this.img.height/2) : this.img.height;
    const xEnd = pivot === Pivot.Center ? Math.ceil(this.img.width/2) : this.img.width;

    for(let y = yInit; y < yEnd; y++) {
      for(let x = xInit; x < xEnd; x++) {
        pixelPositionMatrix[0].push(x)
        pixelPositionMatrix[1].push(y)
        pixelPositionMatrix[2].push(1)
      }
    }

    return pixelPositionMatrix;
  }

  private getOutputPixelData(
    inM: PixelPositionMatrix,
    outM: PixelPositionMatrix,
    inImg: CanvasImage,
    outImg: CanvasImage
  ) : Uint8ClampedArray {
    const inPixelData = this.ctx.getImageData(this.img.x, this.img.y, this.img.width, this.img.height).data,
      outPixelData = new Uint8ClampedArray(4*outImg.width*outImg.height);
    
    const size = inImg.width*inImg.height;
    for(let n = 0; n < size; n++) {
      const inX = inImg.x + inM[0][n],
            inY = inImg.y + inM[1][n],
            outX = outImg.x + Math.round(outM[0][n]),
            outY = outImg.y + Math.round(outM[1][n]);

      if(outX >= outImg.width || outY >= outImg.height)
        continue;

      const inIdx = 4 * (inY * inImg.width + inX);
      const outIdx = 4 * (outY * outImg.width + outX);
      
      outPixelData[outIdx + 0] = inPixelData[inIdx + 0]; // R
      outPixelData[outIdx + 1] = inPixelData[inIdx + 1]; // G
      outPixelData[outIdx + 2] = inPixelData[inIdx + 2]; // B
      outPixelData[outIdx + 3] = inPixelData[inIdx + 3]; // A
    }

    return outPixelData;
  }

  private draw(pixelData: Uint8ClampedArray, drawImg?: CanvasImage): void {
    if (!drawImg)
      drawImg = {
        x: 0,
        y: 0,
        width: this.width,
        height: this.height
      };
    
    const imageData = new ImageData(pixelData, drawImg.width, drawImg.height);
      
    this.ctx.clearRect(0,0,this.width,this.height);
    this.ctx.putImageData(imageData, drawImg.x, drawImg.y);
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

    const inImg: CanvasImage = { 
      ...this.img,
      x: 0,
      y: 0
    };
    const outImg: CanvasImage = {
      ...this.img,
      width: this.width,
      height: this.height
    };
    
    const pixelData = this.getOutputPixelData(inM, outM, inImg, outImg);

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

    const inImg: CanvasImage = {
      ...this.img,
      x: 0,
      y: 0
    };
    const outImg: CanvasImage = {
      ...inImg,
      width: Math.round(sx*this.img.width),
      height: Math.round(sy*this.img.height)
    };

    const pixelData = this.getOutputPixelData(inM, outM, inImg, outImg);

    this.img.width = outImg.width;
    this.img.height = outImg.height;

    const drawImg = { ...this.img } as CanvasImage;
    this.draw(pixelData, drawImg);
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

    const inM = this.getPixelPositionMatrix(Pivot.Center),
          outM = multiply(rM, inM) as PixelPositionMatrix;

    const inImg: CanvasImage = {
      ...this.img,
      x: Math.floor(this.img.width/2),
      y: Math.floor(this.img.height/2)
    };
    const outImg: CanvasImage = {
      ...inImg,
      width: this.width,
      height: this.height
    };

    const pixelData = this.getOutputPixelData(inM, outM, inImg, outImg);

    const drawImg = { ...outImg, x: this.img.x, y: this.img.y } as CanvasImage;
    this.draw(pixelData, drawImg);
  }

  public async mirrorImage(direction: Mirror): Promise<void> {
    const xM = direction === Mirror.Horizontal ? -1 : 1,
          yM = direction === Mirror.Vertical ? -1 : 1;
    
    const mM: MirrorMatrix = [
      [ xM,  0,  0 ],
      [  0, yM,  0 ],
      [  0,  0,  1 ]
    ];

    const inM = this.getPixelPositionMatrix(),
          outM = multiply(mM, inM) as PixelPositionMatrix;


    const inImg: CanvasImage= {
      ...this.img,
      x: 0,
      y: 0
    };
    const outImg: CanvasImage = {
      ...this.img,
      x: direction === Mirror.Horizontal ? this.img.width - 1 : 0,
      y: direction === Mirror.Vertical ? this.img.height - 1 : 0
    };

    const pixelData = this.getOutputPixelData(inM, outM, inImg, outImg);
    
    const drawImg = { ...this.img } as CanvasImage;
    this.draw(pixelData, drawImg);
  }

}