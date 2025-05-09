/** --------------------------------------------------------------------------------
 *-- Description： Route Guard
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  confirm(): boolean;
  confirmDialog(): boolean | Observable<boolean>;
}

@Injectable({
  providedIn: 'root',
})
export class DeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  constructor() {}

  canDeactivate(
    component: CanComponentDeactivate,
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> {
    if (!component.confirm()) {
      return component.confirmDialog();
    }
    return true;
  }
}
