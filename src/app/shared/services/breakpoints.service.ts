/** --------------------------------------------------------------------------------
 *-- Description： breakpoint service
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Injectable } from '@angular/core';

export const CustomBreakpointNames = {
  Small: 'small',
  Medium: 'medium',
  Large: 'large',
  XLarge: 'xlarge',
};

@Injectable({
  providedIn: 'root',
})
export class BreakpointsService {
  breakpoints: any = {
    '(max-width: 1023px)': CustomBreakpointNames.Small,
    '(min-width: 1024px)': CustomBreakpointNames.Medium,
    '(min-width: 1280px)': CustomBreakpointNames.Large,
    '(min-width: 1920px)': CustomBreakpointNames.XLarge,
  };

  /** get breakpoints */
  getBreakpoints(): string[] {
    return Object.keys(this.breakpoints);
  }

  /** get breakpoint name */
  getBreakpointName(breakpointValue: string): string {
    return this.breakpoints[breakpointValue];
  }
  constructor() {}
}
