import Canvas from "./Canvas";

export default function declareCanvasControls(canvas: Canvas) {
  
  document.querySelector<HTMLInputElement>("#open-image")!
    .addEventListener("change", async function () {
      const file = this.files![0]
      
      const imgSrc = URL.createObjectURL(file);

      await canvas.loadImage(imgSrc);
      
      URL.revokeObjectURL(imgSrc);
      
    });
  
  document.querySelector<HTMLButtonElement>("#download")!
    .addEventListener("click", async function () {
      const htmlCanvas = document.querySelector<HTMLCanvasElement>("#canvas")!;

      const link = document.createElement('a') as HTMLAnchorElement;
      
      link.download = 'download.png';
      link.href = htmlCanvas.toDataURL();
      link.click();
      link.remove();
    });

  document.querySelector<HTMLFormElement>("#to-gray-scale")!
    .addEventListener("submit", async function (e: Event) {
      e.preventDefault();
      await canvas.toGrayScale();
    });

  document.querySelector<HTMLFormElement>("#contrast")!
    .addEventListener("submit", async function (e: Event) {
      e.preventDefault();

      const contrast = parseFloat(
        this.querySelector<HTMLInputElement>('[name="contrast-range"]')!.value
      );

      if (isNaN(contrast)) throw new Error("Value is not a number!");

      await canvas.applyContrast(contrast);
    });

  document.querySelector<HTMLFormElement>("#brightness")!
    .addEventListener("submit", async function (e: Event) {
      e.preventDefault();

      const brightness = parseInt(
        this.querySelector<HTMLInputElement>('[name="brightness-range"]')!.value
      );

      if (isNaN(brightness)) throw new Error("Value is not a number!");

      await canvas.applyBrightness(brightness);
    });

  document.querySelector<HTMLFormElement>("#translate")!
    .addEventListener("submit", async function (e: Event) {
      e.preventDefault();

      const tx = parseInt(
        this.querySelector<HTMLInputElement>('[name="tx"]')!.value
      );
      const ty = parseInt(
        this.querySelector<HTMLInputElement>('[name="ty"]')!.value
      );

      if (isNaN(tx) || isNaN(ty)) throw new Error("Value is not a number!");

      await canvas.translateImage(tx, ty);
    });

  document.querySelector<HTMLFormElement>("#resize")!
    .addEventListener("submit", async function (e: Event) {
      e.preventDefault();

      const sx = parseFloat(
        this.querySelector<HTMLInputElement>('[name="sx"]')!.value
      );
      const sy = parseFloat(
        this.querySelector<HTMLInputElement>('[name="sy"]')!.value
      );

      if (isNaN(sx) || isNaN(sy)) throw new Error("Value is not a number!");

      await canvas.resizeImage(sx, sy);
    });

  document.querySelector<HTMLFormElement>("#rotate")!
    .addEventListener("submit", async function (e: Event) {
      e.preventDefault();

      const angle = parseFloat(
        this.querySelector<HTMLInputElement>('[name="angle"]')!.value
      );

      if (isNaN(angle)) throw new Error("Value is not a number!");

      await canvas.rotateImage(angle);
    });

  document.querySelector<HTMLFormElement>("#mirror")!
    .addEventListener("submit", async function (e: Event) {
      e.preventDefault();

      const direction = this.querySelector<HTMLSelectElement>(
        '[name="direction"]'
      )!.value as string;

      const mirror =
        direction === "horizontal"
          ? Canvas.Mirror.Horizontal
          : Canvas.Mirror.Vertical;

      await canvas.mirrorImage(mirror);
    });
}
