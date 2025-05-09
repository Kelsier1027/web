/** --------------------------------------------------------------------------------
 *-- Description： 登入api
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { NotifierService } from 'src/app/shared/services/notifier.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { filter, map, Observable, shareReplay } from 'rxjs';
import { HttpDefaultOptions, JWTOptions } from '../../core/model/option';
import { ErrorServiceService } from '../../core/services/error-service.service';
import { StorageService } from '../../core/services/storage.service';
import { AuthToken, Response } from 'src/app/core/model';
import jwt_decode from 'jwt-decode';
import { ResultRes } from 'src/app/models';
import { LOCAL_STORAGE_CACHE } from 'src/app/shared/utils/localStorageCacheUtilities';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends ErrorServiceService {
  // cache permision
  permission$!: Observable<{ [key: string]: any }> | undefined;

  // 登入後跳轉的網址 by api advertiseImg
  relatedUrl: string = '';

  constructor(
    http: HttpClient,
    options: HttpDefaultOptions,
    router: Router,
    storage: StorageService,
    notifier: NotifierService,
    private token: JWTOptions
  ) {
    super(http, options, router, storage, notifier);
  }

  /** 登入 */
  login(param: any) {
    const url = '/api/web/identity/Account/login';

    LOCAL_STORAGE_CACHE.InvalidateAllCaches();

    return this.post(url, {
      body: { ...param },
    });
  }

  /** 登出 */
  logout(param: any) {
    const url = '/api/web/identity/Account/logout';
    return this.post(url, {
      body: { ...param },
    });
  }

  /** 取得廣告圖 */
  advertiseImg(orgId: number) {
    const url = `/api/web/identity/Account/login/ad?orgId=${orgId}`;
    return this.get(url);
  }

  /** refresh token 未使用 */
  refreshToken(param: any) {
    const url = 'api/account/auth/token_refresh';
    return this.post(url, { body: param });
  }

  /** 取得權限api 未使用 */
  private getPermission(): Observable<{ result_data: Record<string, any> }> {
    const url = 'api/account/back/permission';
    return this.get(url);
  }

  /** getter 是否logged in */
  get isLoggedIn(): boolean {
    return this.storage.hasItem(this.token.key!);
  }

  /** getter 是否帳號管理員 */
  get isAdmin(): boolean {
    const auth: AuthToken =
      (!!this.token.key && this.storage.get(this.token.key)) || {};
    const decoded = jwt_decode(auth.token!) as { [key: string]: string };

    return decoded[
      'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
    ]
      ? decoded[
          'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ] === 'ADMIN'
      : false;
  }

  /** 取得權限 */
  getPermissions(): Observable<{ [key: string]: any }> {
    if (!this.permission$) {
      this.permission$ = this.getPermission().pipe(
        filter(() => this.storage.hasItem(this.token.key!)),
        map((data) => data.result_data),
        shareReplay(1)
      );
    }
    return this.permission$;
  }

  /** 忘記密碼 */
  forgotPassword(param: { orgId: number; companyNo: string; account: string }) {
    const url = '/api/web/identity/Account/forgotPassword';
    return this.post(url, { queryObject: param });
  }

  /** 註冊會員 */
  joinUs(param: {
    orgId: number;
    companyNo: string;
    companyName: string;
    tel: string;
    contactName: string;
    account: string;
    recaptcha: string;
  }) {
    const url = '/api/web/identity/Account/joinUs';
    return this.post(url, { body: param });
  }

    /** 取得註冊成功後訊息資訊 */
    registerSuccess(orgId: number) {
      const url = `/api/web/identity/Account/registerSuccess/${orgId}`;
      return this.get(url);
    }


  /** 重設密碼 */
  resetPassword(param: {
    oldPassword: string;
    newPassword: string;
    userId: number;
    recaptcha: string;
    orgId: number;
  }) {
    const url = '/api/web/identity/Account/resetPassword';
    return this.patch(url, { body: param });
  }

  /** 會員權限 */
  memberRight(orgId: number) {
    const url = `/api/web/identity/Account/memberRight/${orgId}`;
    return this.get(url);
  }

  /** 常見問題 */
  getFaq(orgId: number) {
    const url = `/api/web/identity/faq?OrgId=${orgId}`;
    return this.get(url);
  }

  /** 重要公告 */
  getBulletin(orgId: number) {
    const url = `/api/web/identity/Bulletin?OrgId=${orgId}`;
    return this.get(url);
  }

  /** 重要公告內容 */
  getBulletinDetail(id: number) {
    const url = `/api/web/identity/Bulletin/${id}`;
    return this.get(url);
  }

  /** Firebase內容 */
  getRegisterFirebase(param: {
    Token: string;
  }) {
      const url = `/api/web/identity/Account/registerFirebase`;
      return this.post(url, { body: param });
    }

  /** 後匯款通知 */
  notifyPayment(accessToken: string): Observable<Response>
  {
    const url = `/api/web/customer/checkout/notifyPaymentFromMail?accessToken=${accessToken}`;
    return this.get(url);
  }
}
