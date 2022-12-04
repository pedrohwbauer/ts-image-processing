import { multiply } from "mathjs";

import { Transform } from "@transform";

import type { PixelPositionMatrix } from "@custom-types";

import { Mirror } from "@transform/enums";

export default class MirrorImage extends Transform {
  public async execute(direction: Mirror, canvasCtrl = this.canvasCtrl) {
    const xM = direction === Mirror.Horizontal ? -1 : 1,
      yM = direction === Mirror.Vertical ? -1 : 1;

    const mirrorMatrix = [
      [xM, 0, 0],
      [0, yM, 0],
      [0, 0, 1],
    ];

    const inM = canvasCtrl.getPixelPositionMatrix(),
      outM = multiply(mirrorMatrix, inM) as unknown as PixelPositionMatrix;

    const inImg = {
      ...canvasCtrl.img,
      x: 0,
      y: 0,
    } as typeof canvasCtrl.img;

    const outImg = {
      ...canvasCtrl.img,
      x: direction === Mirror.Horizontal ? canvasCtrl.img.width - 1 : 0,
      y: direction === Mirror.Vertical ? canvasCtrl.img.height - 1 : 0,
    } as typeof canvasCtrl.img;

    const pixelData = canvasCtrl.getOutputPixelData(inM, outM, inImg, outImg);

    const drawImg = { ...canvasCtrl.img } as typeof canvasCtrl.img;
    canvasCtrl.draw(pixelData, drawImg);
  }
}
