import { ChartData } from './interfaces/ChartData';
import { ChartOptions } from './interfaces/ChartOptions';
import { DrawingCore } from './DrawingCore';

export class DoughnutChart {
  core: DrawingCore;

  constructor(
    private canvas: HTMLCanvasElement,
    private options: ChartOptions,
  ) {
    this.core = new DrawingCore(canvas, options);

    const { width, height } = canvas;
    const dpr = window.devicePixelRatio;

    if (dpr > 1) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      this.core.scale(dpr);
    }
  }

  data(data: ChartData[]) {
    this.core.data(data);
  }
}
