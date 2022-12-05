import { Morphology } from "./absctract-morphology";

export default class Closing extends Morphology {
  async execute(intensity: number) {
    const canvasCtrl = this.getSelfCanvasController()!;

    const pixelData = canvasCtrl.ctx.getImageData(
      0,
      0,
      canvasCtrl.width,
      canvasCtrl.height
    ).data;

    const inRgbaM = this.getRGBAMatrixFromPixelData(
      pixelData,
      canvasCtrl.width,
      canvasCtrl.height
    );

    const midRgbaM = this.dilationRGBA(inRgbaM, intensity);

    const outRgbaM = this.erosionRGBA(midRgbaM, intensity);

    const outPixelData = this.getPixelDataFromRGBAMatrix(outRgbaM);

    canvasCtrl.draw(outPixelData);
  }
}
