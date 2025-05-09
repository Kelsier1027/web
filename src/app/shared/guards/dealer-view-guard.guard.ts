import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, lastValueFrom } from 'rxjs';
import { DialogService } from '../services';
import { URL_UTIL } from '../utils/urlUtilities';

@Injectable({
  providedIn: 'root'
})

export class DealerViewGuardGuard implements CanActivate {
  constructor(private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const canUseDealerView = localStorage.getItem('canUseDealerView') as boolean | null;

    // 不能使用經銷商檢視，不檢查
    if (!canUseDealerView)
      return true;

    return this.checkDealerViewParam(next, state);
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.canActivate(next, state);
  }

  async checkDealerViewParam(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    // 檢查現在的 route 中有沒有 dealerView, 如果沒有就不處理, 放行
    const currentRoute = this.route.snapshot;
    const currentParams = currentRoute.queryParams;

    if (!currentParams)
      return true;

    const dealerView = currentParams['dealerView'];

    if (!dealerView?.length)
      return true;

    // 檢查是不是支援經銷商檢視的 route
    const isSupported = URL_UTIL.canUseDealerView(state);

    if (isSupported)
      return true;

    return await this.promptCancel(next);
  }

  /** 取消經銷商 */
  async promptCancel(next: ActivatedRouteSnapshot): Promise<boolean> {
    const modelOption = {
      modelName: 'simple-dialog',
      config: {
        data: {
          title: '取消檢視經銷商',
          StyleMargin: '0px',
          text: '此功能不支援檢視經銷商，請確認是否要取消檢視此經銷商頁面',
          displayFooter: true,
          cancelButton: '否，繼續檢視',
          confirmButton: '是，結束檢視經銷商',
          color: 'warn'
        },
        width: '500px',
        height: '204px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: ''
      },
    };
    const source$ = this.dialogService
      .openLazyDialog(modelOption.modelName, modelOption.config)
      .then((ref) => {
        return lastValueFrom(ref.afterClosed())
      });

    const result = (await source$) as boolean;

    // 如果使用者按取消，回傳 false 阻止跳轉
    if (!result)
      return false;

    return true;
  };
}
