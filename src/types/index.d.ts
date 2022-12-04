type X = number;
type Y = number;
export type PixelPositionMatrix = [X[], Y[], 1[]];

import { CanvasController as CanvasControllerClass } from "@canvas";
export type CanvasController = CanvasControllerClass;

import { Transform as TransformAbstract } from "@transform";
export type Transform = TransformAbstract;

import { createTransforms } from "@factory/transforms-factory";
export type Transforms = ReturnType<typeof createTransforms>;