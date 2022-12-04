import { multiply } from "mathjs";

import { Transform } from "@transform";

import { PixelPositionMatrix } from "@custom-types";

import { Pivot } from "@transform/enums";

export default class RotateImage extends Transform {
  public async execute(angle: number, canvasCtrl = this.canvasCtrl) {
    const radians = (angle * Math.PI) / 180;

    const cos = Math.cos(radians),
      sin = Math.sin(radians);

    const rotationMatrix = [
      [cos, -sin, 0],
      [sin, cos, 0],
      [0, 0, 1],
    ];

    const inM = canvasCtrl.getPixelPositionMatrix(Pivot.Center),
      outM = multiply(rotationMatrix, inM) as unknown as PixelPositionMatrix;

    const inImg = {
      ...canvasCtrl.img,
      x: Math.floor(canvasCtrl.img.width / 2),
      y: Math.floor(canvasCtrl.img.height / 2),
    } as typeof canvasCtrl.img;

    const outImg = {
      ...inImg,
      width: canvasCtrl.width,
      height: canvasCtrl.height,
    } as typeof canvasCtrl.img;

    const pixelData = canvasCtrl.getOutputPixelData(inM, outM, inImg, outImg);

    const drawImg = {
      ...outImg,
      x: canvasCtrl.img.x,
      y: canvasCtrl.img.y,
    } as typeof canvasCtrl.img;
    canvasCtrl.draw(pixelData, drawImg);
  }
}
