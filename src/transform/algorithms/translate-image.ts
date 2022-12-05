import { multiply } from "mathjs";

import { Transform } from "@transform";

import { PixelPositionMatrix, ImagePositionData } from "@custom-types";

export default class TranslateImage extends Transform {
  async execute(tx: number, ty: number) {
    const canvasCtrl = this.getSelfCanvasController()!;

    const translationMatrix = [
      [1, 0, tx],
      [0, 1, ty],
      [0, 0, 1],
    ];

    const inM = this.getPixelPositionMatrix(),
      outM = multiply(translationMatrix, inM) as unknown as PixelPositionMatrix;

    const inImg = {
      ...canvasCtrl.img,
      x: 0,
      y: 0,
    } as ImagePositionData;

    const outImg = {
      ...canvasCtrl.img,
      width: canvasCtrl.width,
      height: canvasCtrl.height,
    } as ImagePositionData;

    const pixelData = this.getOutputPixelDataFromPixelPosition(inM, outM, inImg, outImg);

    canvasCtrl.img.x += tx;
    canvasCtrl.img.y += ty;

    canvasCtrl.draw(pixelData);
  }
}
