import type { CanvasController } from "@custom-types";

export abstract class Transform {
  protected canvasCtrl: CanvasController;

  constructor(canvasCtrl: CanvasController) {
    this.canvasCtrl = canvasCtrl;
  }

  abstract execute(...args: any[]): Promise<void>;
}
