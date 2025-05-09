/** --------------------------------------------------------------------------------
 *-- Description： layout service
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { last, map, shareReplay, switchMap } from 'rxjs/operators';
import { BreakpointsService } from './breakpoints.service';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  constructor(
    private breakpointObserver: BreakpointObserver,
    private breakpointService: BreakpointsService
  ) {}

  layoutChanges$ = this.breakpointObserver
    .observe(this.breakpointService.getBreakpoints())
    .pipe(
      map((observeResponse) => Object.entries(observeResponse.breakpoints)),
      map((response) => response.filter(([_key, isActive]) => isActive)),
      switchMap((response) => from(response).pipe(last())),
      map(([key]) => this.breakpointService.getBreakpointName(key)),
      shareReplay(1)
    );
}
