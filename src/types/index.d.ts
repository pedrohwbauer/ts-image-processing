type X = number;
type Y = number;
export type PixelPositionMatrix = [X[], Y[], 1[]];

import { CanvasController as CanvasControllerClass } from "@controllers/canvas-controller";
export type CanvasController = CanvasControllerClass;

import { Transform as TransformAbstract } from "@transform";
export type Transform = TransformAbstract;

import { createTransforms } from "@factories/transforms-factory";
export type Transforms = ReturnType<typeof createTransforms>;