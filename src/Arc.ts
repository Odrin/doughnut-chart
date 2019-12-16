import { Color } from 'color-string';
import { ChartData } from './interfaces/ChartData';

export class Arc {
  angle = 0;
  color: Color = [0, 0, 0, 0];

  constructor(public original: ChartData) {
  }
}
