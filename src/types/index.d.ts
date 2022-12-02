type X = number;
type Y = number;
export type PixelPositionMatrix = [X[], Y[], 1[]];

import CanvasClass from "@canvas";
export type Canvas = CanvasClass;

import { Transform as TransformInterface } from "@transform/interface";
export type Transform = TransformInterface;

import { createTransforms } from "@factory/transforms-factory";
export type Transforms = ReturnType<typeof createTransforms>;