export type ImagePositionData = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type X = number;
type Y = number;
export type PixelPositionMatrix = [X[], Y[], 1[]];

export type PixelMatrix = Uint8ClampedArray[];
export type RGBAMatrix = [
  PixelMatrix, // R
  PixelMatrix, // G
  PixelMatrix, // B
  PixelMatrix // A
];

import { CanvasController as CanvasControllerClass } from "@controllers/canvas-controller";
export type CanvasController = CanvasControllerClass;

import { Transform as TransformAbstract } from "@transform";
export type Transform = TransformAbstract;

import { createTransforms } from "@factories/transforms-factory";
export type Transforms = ReturnType<typeof createTransforms>;
