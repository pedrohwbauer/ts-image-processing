import { multiply } from "mathjs";

import { Transform } from "@transform";

import {  PixelPositionMatrix } from "@custom-types";

export default class resizeImage extends Transform {
  public async execute(sx: number, sy: number, canvasCtrl = this.canvasCtrl) {
    const scaleMatrix = [
      [sx, 0, 0],
      [0, sy, 0],
      [0, 0, 1],
    ];

    const inM = canvasCtrl.getPixelPositionMatrix(),
      outM = multiply(scaleMatrix, inM) as unknown as PixelPositionMatrix;

    const inImg = {
      ...canvasCtrl.img,
      x: 0,
      y: 0,
    } as typeof canvasCtrl.img;

    const outImg = {
      ...inImg,
      width: Math.round(sx! * canvasCtrl.img.width),
      height: Math.round(sy! * canvasCtrl.img.height),
    } as typeof canvasCtrl.img;

    const pixelData = canvasCtrl.getOutputPixelData(inM, outM, inImg, outImg);

    canvasCtrl.img.width = outImg.width;
    canvasCtrl.img.height = outImg.height;

    const drawImg = { ...canvasCtrl.img } as typeof canvasCtrl.img;
    canvasCtrl.draw(pixelData, drawImg);
  }
}
