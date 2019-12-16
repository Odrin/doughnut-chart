import { EasingFunctions } from '../utils/EasingFunctions';

export interface ChartOptions {
  cutoutPercentage: number;
  animationDuration: number;
  animationEasing: keyof (typeof EasingFunctions);
}
