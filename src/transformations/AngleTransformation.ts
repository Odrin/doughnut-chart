import { Arc } from '../Arc';
import { ArcTransformation, TransformationConfig } from './ArcTransformation';
import { EasingFunctions } from '../utils/EasingFunctions';

export interface AngleTransformationConfig extends TransformationConfig {
  from: number;
  to: number;
}

export class AngleTransformation extends ArcTransformation {
  readonly type = 'angle';

  constructor(
    public arc: Arc,
    protected config: AngleTransformationConfig,
  ) {
    super();
  }

  protected onStep(k: number) {
    const { from, to } = this.config;

    this.arc.angle = from + (to - from) * k;
  }
}
