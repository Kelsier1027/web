import { Injectable, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterModule, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { POP_UP } from '../utils/popUpUtilities';
import { DialogService } from '../services';

@Injectable({
  providedIn: 'root'
})
export class SalesMemberAccessGuard implements CanActivate, CanActivateChild {

  constructor(private router: Router, private dialogService: DialogService) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      // 採購員在會員中心只能看到公司帳戶頁
      const isSales = this.isSales();

      if (isSales == false)
        return true;

      const nextRoute = state.url.toLowerCase();
      const nextIsMember = nextRoute.startsWith('/member');
      const nextIsShoppingCart = nextRoute.startsWith('/shoppingcart');
      const nextNeedsCheck = nextIsMember || nextIsShoppingCart;

      if (!nextNeedsCheck)
        return true;

      const nextIsMemberAccount = nextRoute.startsWith('/member/account');    

      if (nextIsMemberAccount)
        return true;

      // 判定要留在原地還是跳頁。
      // 透過 router 判定是正常瀏覽，還是手動輸入網址。
      const isInAppNavigating: boolean = this.router.navigated;
      const hint = ['很抱歉，您的身分組（查價員）無法檢視該頁面。', '如有疑問，請聯絡您的帳戶管理員，或聯絡線上客服。'];

      if (!isInAppNavigating) {
        hint.push('');
        hint.push('已為您跳轉回首頁，歡迎繼續選購。');
      }

      POP_UP.showMessage(this.dialogService, 
        '您的身分組不支援該頁面', 
        hint);

      if (isInAppNavigating)
        return false;

      // 使用者手動輸入不可瀏覽的頁面。
      // 這時若直接讓 guard 回傳 false，angular 仍會嘗試跳回首頁，但會卡空白。
      // 所以這時候要特別抓出來，透過 router 明示 navigate 回首頁。
      const toHomepage = this.router.createUrlTree(['/']);
      return toHomepage;
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
 
  isSales(): boolean {
    return JSON.parse(localStorage.getItem('isSales') ?? 'true');
  }
}
