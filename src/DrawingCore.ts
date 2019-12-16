import colorString from 'color-string';
import { Arc } from './Arc';
import { AngleTransformation } from './transformations/AngleTransformation';
import { ArcTransformation } from './transformations/ArcTransformation';
import { ChartData } from './interfaces/ChartData';
import { ChartOptions } from './interfaces/ChartOptions';
import { ColorTransformation } from './transformations/ColorTransformation';

export class DrawingCore {
  private ctx: CanvasRenderingContext2D;
  private dpr = 1;
  private arcs: Arc[] = [];
  private transformations: ArcTransformation[] = [];
  private rafId: number | null = null;

  constructor(
    private canvas: HTMLCanvasElement,
    private options: ChartOptions,
  ) {
    this.ctx = canvas.getContext('2d');
  }

  scale(dpr: number) {
    this.dpr = dpr;
    this.ctx.scale(dpr, dpr);
  }

  data(data: ChartData[]) {
    let sum = 0;

    for (let i = 0; i < data.length; i++) {
      const item = data[i];

      if (i < this.arcs.length) {
        this.arcs[i].original = item;
      } else {
        const arc = new Arc(item);
        this.arcs.push(arc);
      }

      sum += item.value;
    }

    for (let i = 0; i < this.arcs.length; i++) {
      const arc = this.arcs[i];

      if (i < data.length) {
        const angle = Math.PI * (arc.original.value / sum) * 2;
        const color = colorString.get.rgb(arc.original.color);

        if (color === null) throw new Error(`Unsupported color format: ${arc.original.color}`);

        if (arc.angle !== angle) {
          this.addTransformation(new AngleTransformation(arc, {
            from: arc.angle,
            to: angle,
            duration: this.options.animationDuration,
            easing: this.options.animationEasing
          }));
        }

        if (arc.angle !== 0 && arc.color.some((c, i) => c !== color[i])) {
          this.addTransformation(new ColorTransformation(arc, {
            from: arc.color,
            to: color,
            duration: this.options.animationDuration,
            easing: this.options.animationEasing
          }));
        } else {
          arc.color = color;
        }
      } else {
        // transform to 0 and remove
        this.addTransformation(new AngleTransformation(arc, {
          from: arc.angle,
          to: 0,
          duration: this.options.animationDuration,
          easing: this.options.animationEasing,
          onComplete: () => this.removeArc(arc),
        }));
      }
    }
  }

  draw() {
    const { width, height } = this.canvas;
    const centerX = width / 2;
    const centerY = height / 2;
    let startAngle = Math.PI * -0.5;

    this.ctx.clearRect(0, 0, width, height);
    this.ctx.lineWidth = 1;

    for (const arc of this.arcs) {
      this.ctx.save();
      this.ctx.fillStyle = colorString.to.rgb(arc.color);
      this.ctx.strokeStyle = '#fff'; // TODO: stroke
      this.ctx.beginPath();
      this.ctx.moveTo(centerX, centerY);
      this.ctx.arc(centerX, centerY, height / 2, startAngle, startAngle + arc.angle, false);
      this.ctx.lineTo(centerX, centerY);
      this.ctx.closePath();
      this.ctx.fill();
      // this.ctx.stroke();
      this.ctx.restore();

      startAngle = startAngle + arc.angle;
    }

    if (this.options.cutoutPercentage > 0) {
      const radius = height * this.options.cutoutPercentage / 100 / 2;

      this.ctx.save();
      this.ctx.fillStyle = '#fff';
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  private removeArc(arc: Arc) {
    this.arcs = this.arcs.filter((item) => item !== arc);
  }

  private addTransformation(transform: ArcTransformation) {
    const index = this.transformations.findIndex((item) => item.arc === transform.arc && item.type === transform.type);

    if (index === -1) {
      this.transformations.push(transform);
    } else {
      this.transformations[index] = transform; // TODO
    }

    if (this.rafId === null) {
      this.rafId = requestAnimationFrame((time) => this.handleAnimationFrame(time));
    }
  }

  private handleAnimationFrame(time: number) {
    let finished = false;

    for (const transform of this.transformations) {
      transform.apply(time);

      if (transform.finished) {
        finished = true;
      }
    }

    this.draw();

    if (finished) {
      this.transformations = this.transformations.reduce((result, transform) => {
        if (transform.finished) {
          transform.onComplete();
        } else {
          result.push(transform);
        }

        return result;
      }, [] as Array<ArcTransformation>);
    }

    if (this.transformations.length > 0) {
      this.rafId = requestAnimationFrame((time) => this.handleAnimationFrame(time));
    } else {
      this.rafId = null;
    }
  }
}
