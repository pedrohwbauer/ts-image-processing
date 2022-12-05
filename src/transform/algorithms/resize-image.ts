import { multiply } from "mathjs";

import { Transform } from "@transform";

import { PixelPositionMatrix, ImagePositionData } from "@custom-types";

export default class resizeImage extends Transform {
  public async execute(sx: number, sy: number) {
    const canvasCtrl = this.getSelfCanvasController()!;

    const scaleMatrix = [
      [sx, 0, 0],
      [0, sy, 0],
      [0, 0, 1],
    ];

    const inM = this.getPixelPositionMatrix(),
      outM = multiply(scaleMatrix, inM) as unknown as PixelPositionMatrix;

    const inImg = {
      ...canvasCtrl.img,
      x: 0,
      y: 0,
    } as ImagePositionData;

    const outImg = {
      ...inImg,
      width: Math.round(sx * canvasCtrl.img.width),
      height: Math.round(sy * canvasCtrl.img.height),
    } as ImagePositionData;

    const pixelData = this.getOutputPixelDataFromPixelPosition(inM, outM, inImg, outImg);

    canvasCtrl.img.width = outImg.width;
    canvasCtrl.img.height = outImg.height;

    const drawImg = { ...canvasCtrl.img } as typeof canvasCtrl.img;
    canvasCtrl.draw(pixelData, drawImg);
  }
}
