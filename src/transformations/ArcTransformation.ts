import { Arc } from '../Arc';
import { EasingFunctions } from '../utils/EasingFunctions';

export interface TransformationConfig {
  duration: number;
  easing: keyof (typeof EasingFunctions);
  onComplete?: () => void;
}

export abstract class ArcTransformation {
  readonly abstract type: string;

  arc: Arc;
  finished = false;

  protected startedAt = 0;
  protected config: TransformationConfig;

  apply(time: number) {
    if (this.finished) return;

    if (this.startedAt === 0) {
      this.startedAt = time;
      return;
    }

    const { duration, easing } = this.config;
    const t = duration <= 0 ? 1 : Math.min((time - this.startedAt) / duration, 1);
    const k = EasingFunctions[easing](t);

    if (t === 1) {
      this.finished = true;
    }

    this.onStep(k);
  }

  onComplete() {
    this.config.onComplete?.();
  }

  protected abstract onStep(k: number);
}
