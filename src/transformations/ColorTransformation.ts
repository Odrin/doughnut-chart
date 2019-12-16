import { Color } from 'color-string';
import { Arc } from '../Arc';
import { ArcTransformation, TransformationConfig } from './ArcTransformation';

export interface ColorTransformationConfig extends TransformationConfig {
  from: Color;
  to: Color;
}

export class ColorTransformation extends ArcTransformation {
  readonly type = 'color';

  constructor(
    public arc: Arc,
    protected config: ColorTransformationConfig,
  ) {
    super();
  }

  protected onStep(k: number) {
    const { from, to } = this.config;

    this.arc.color = from.map((channel, i) => channel + (to[i] - channel) * k) as Color;
  }
}
