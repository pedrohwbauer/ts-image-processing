import { multiply } from "mathjs";

import { Transform } from "@transform";

import { PixelPositionMatrix } from "@custom-types";

export default class TranslateImage extends Transform {
  async execute(tx: number, ty: number, canvasCtrl = this.canvasCtrl) {
    const translationMatrix = [
      [1, 0, tx],
      [0, 1, ty],
      [0, 0, 1],
    ];

    const inM = canvasCtrl.getPixelPositionMatrix(),
      outM = multiply(translationMatrix, inM) as unknown as PixelPositionMatrix;

    const inImg = {
      ...canvasCtrl.img,
      x: 0,
      y: 0,
    } as typeof canvasCtrl.img;

    const outImg = {
      ...canvasCtrl.img,
      width: canvasCtrl.width,
      height: canvasCtrl.height,
    } as typeof canvasCtrl.img;

    const pixelData = canvasCtrl.getOutputPixelData(inM, outM, inImg, outImg);

    canvasCtrl.img.x += tx;
    canvasCtrl.img.y += ty;

    canvasCtrl.draw(pixelData);
  }
}
