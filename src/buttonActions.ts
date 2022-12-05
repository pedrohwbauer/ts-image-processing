import type { Transforms, CanvasController } from "@custom-types";
import { Mirror } from "@transform/enums";

export function declareButtonActions(
  canvasCtrl: CanvasController,
  transforms: Transforms
) {
  document
    .querySelector<HTMLInputElement>("#open-image")!
    .addEventListener("change", async function () {
      const file = this.files![0];

      const imgSrc = URL.createObjectURL(file);

      await canvasCtrl.loadImage(imgSrc);

      URL.revokeObjectURL(imgSrc);
    });

  document
    .querySelector<HTMLButtonElement>("#download")!
    .addEventListener("click", async function () {
      const htmlCanvas = document.querySelector<HTMLCanvasElement>("#canvas")!;

      const link = document.createElement("a") as HTMLAnchorElement;

      link.download = "download.png";
      link.href = htmlCanvas.toDataURL();
      link.click();
      link.remove();
    });

  document
    .querySelector<HTMLFormElement>("#thresholding")!
    .addEventListener("submit", async function (e: Event) {
      e.preventDefault();

      const threshold = parseFloat(
        this.querySelector<HTMLInputElement>('[name="threshold"]')!.value
      );

      if (isNaN(threshold)) throw new Error("Value is not a number!");

      await transforms["threshold-filter"].execute(threshold);
    });

  document
    .querySelector<HTMLFormElement>("#border-detection")!
    .addEventListener("submit", async function (e: Event) {
      e.preventDefault();

      const threshold = parseFloat(
        this.querySelector<HTMLInputElement>('[name="threshold"]')!.value
      );

      if (isNaN(threshold)) throw new Error("Value is not a number!");
      
      const method = this.querySelector<HTMLSelectElement>(
        '[name="detection-method"]'
      )!.value as string

      switch(method) {
        case "roberts":
          await transforms["roberts-border-detection"].execute(threshold);
        case "kirsch":
          await transforms["kirsch-border-detection"].execute(threshold);
        case "robinson":
          await transforms["robinson-border-detection"].execute(threshold);
      }

    });

  document
    .querySelector<HTMLFormElement>("#mean-filter")!
    .addEventListener("submit", async function (e: Event) {
      e.preventDefault();
      await transforms["mean-filter"].execute();
    });

  document
    .querySelector<HTMLFormElement>("#gaussian-filter")!
    .addEventListener("submit", async function (e: Event) {
      e.preventDefault();
      await transforms["gaussian-filter"].execute();
    });

  document
    .querySelector<HTMLFormElement>("#median-filter")!
    .addEventListener("submit", async function (e: Event) {
      e.preventDefault();
      await transforms["median-filter"].execute();
    });

  document
    .querySelector<HTMLFormElement>("#mode-filter")!
    .addEventListener("submit", async function (e: Event) {
      e.preventDefault();
      await transforms["mode-filter"].execute();
    });

  document
    .querySelector<HTMLFormElement>("#to-gray-scale")!
    .addEventListener("submit", async function (e: Event) {
      e.preventDefault();
      await transforms["to-gray-scale"].execute();
    });

  document
    .querySelector<HTMLFormElement>("#contrast")!
    .addEventListener("submit", async function (e: Event) {
      e.preventDefault();

      const contrast = parseFloat(
        this.querySelector<HTMLInputElement>('[name="contrast-range"]')!.value
      );

      if (isNaN(contrast)) throw new Error("Value is not a number!");

      await transforms["apply-contrast"].execute(contrast);
    });

  document
    .querySelector<HTMLFormElement>("#brightness")!
    .addEventListener("submit", async function (e: Event) {
      e.preventDefault();

      const brightness = parseInt(
        this.querySelector<HTMLInputElement>('[name="brightness-range"]')!.value
      );

      if (isNaN(brightness)) throw new Error("Value is not a number!");

      await transforms["apply-brightness"].execute(brightness);
    });

  document
    .querySelector<HTMLFormElement>("#translate")!
    .addEventListener("submit", async function (e: Event) {
      e.preventDefault();

      const tx = parseInt(
        this.querySelector<HTMLInputElement>('[name="tx"]')!.value
      );
      const ty = parseInt(
        this.querySelector<HTMLInputElement>('[name="ty"]')!.value
      );

      if (isNaN(tx) || isNaN(ty)) throw new Error("Value is not a number!");

      await transforms["translate-image"].execute(tx, ty);
    });

  document
    .querySelector<HTMLFormElement>("#resize")!
    .addEventListener("submit", async function (e: Event) {
      e.preventDefault();

      const sx = parseFloat(
        this.querySelector<HTMLInputElement>('[name="sx"]')!.value
      );
      const sy = parseFloat(
        this.querySelector<HTMLInputElement>('[name="sy"]')!.value
      );

      if (isNaN(sx) || isNaN(sy)) throw new Error("Value is not a number!");

      await transforms["resize-image"].execute(sx, sy);
    });

  document
    .querySelector<HTMLFormElement>("#rotate")!
    .addEventListener("submit", async function (e: Event) {
      e.preventDefault();

      const angle = parseFloat(
        this.querySelector<HTMLInputElement>('[name="angle"]')!.value
      );

      if (isNaN(angle)) throw new Error("Value is not a number!");

      await transforms["rotate-image"].execute(angle);
    });

  document
    .querySelector<HTMLFormElement>("#mirror")!
    .addEventListener("submit", async function (e: Event) {
      e.preventDefault();

      const directionString = this.querySelector<HTMLSelectElement>(
        '[name="direction"]'
      )!.value as string;

      const direction =
        directionString === "horizontal" ? Mirror.Horizontal : Mirror.Vertical;

      await transforms["mirror-image"].execute(direction);
    });
}
