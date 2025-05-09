import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, OperatorFunction, pipe } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BaseService } from './base.service';
import { HttpDefaultOptions, HttpRequestOptions } from '../model/option';
import { StorageService } from './storage.service';
import { NotifierService } from 'src/app/shared/services';
import { ResponseCode } from 'src/app/enums';
import { ErrorMessageMap } from '../constant/error-message-map.constant';
import { NotificationComponent } from 'src/app/shared/components';
import { LOCAL_STORAGE_CACHE, LocalStorageCacheType } from 'src/app/shared/utils/localStorageCacheUtilities';
import 'src/app/shared/utils/observable-extensions';

@Injectable({
  providedIn: 'root',
})
export class ErrorServiceService extends BaseService {
  constructor(
    http: HttpClient,
    options: HttpDefaultOptions,
    protected router: Router,
    protected storage: StorageService,
    private notifierService: NotifierService
  ) {
    super(http, options);
  }

  override get(url: string, httpOptions?: HttpRequestOptions): any {
    let observable = super
      .get(url, httpOptions)
      .pipe(this.handlerAuthError(), this.handleErrorResponse(url))

    return observable;
  }

  getCacheOrQuery<T>(cacheType: LocalStorageCacheType, url: string, httpOptions?: HttpRequestOptions): Observable<T> {
    const cache = LOCAL_STORAGE_CACHE.GetCacheOrNull<T>(cacheType);

    if (cache)
    {
      const bs = new BehaviorSubject(cache);
      return bs.asObservable();
    }
  
    return this.get(url, httpOptions)
      .pipe(tap(res => LOCAL_STORAGE_CACHE.AddOrUpdate(cacheType, res)));
  }

  override patch(url: string, httpOptions?: HttpRequestOptions): any {
    return super
      .patch(url, httpOptions)
      .pipe(this.handlerAuthError(), this.handleErrorResponse(url));
  }

  override post(url: string, httpOptions?: HttpRequestOptions, showDefaultErrorMessage?: boolean): any {
    let observable = super
      .post(url, httpOptions);

    if (!httpOptions?.noLoading)
      observable = observable.enqueueForLoadingMask();

    if (showDefaultErrorMessage != false)
      return observable.pipe(this.handlerAuthError(), this.handleErrorResponse(url));

    return observable;
  }

  postCacheOrRequest<T>(cacheType: LocalStorageCacheType, url: string, httpOptions?: HttpRequestOptions, showDefaultErrorMessage?: boolean): Observable<T> {
    const cache = LOCAL_STORAGE_CACHE.GetCacheOrNull<T>(cacheType);

    if (cache)
    {
      const bs = new BehaviorSubject(cache);
      return bs.asObservable();
    }
  
    return this.post(url, httpOptions, showDefaultErrorMessage)
      .pipe(tap(res => LOCAL_STORAGE_CACHE.AddOrUpdate(cacheType, res)));
  }

  override put(url: string, httpOptions?: HttpRequestOptions): any {
    return super
      .put(url, httpOptions)
      .pipe(this.handlerAuthError(), this.handleErrorResponse(url));
  }

  override delete(url: string, httpOptions?: HttpRequestOptions): any {
    return super
      .delete(url, httpOptions)
      .pipe(this.handlerAuthError(), this.handleErrorResponse(url));
  }

  private handleErrorResponse(url: string): OperatorFunction<unknown, unknown> {
    return pipe(
      map((res: any) => {
        if (res.responseCode && res.responseCode !== ResponseCode.Success) {
          const errorMap = ErrorMessageMap[res.responseCode];

          return errorMap
            ? {
                ...res,
                errorMessage: {
                  type: errorMap.type,
                  message: errorMap.message,
                },
              }
            : {
                ...res,
                errorMessage: { type: 'error', message: res.responseMessage },
              };
        } else {
          // bypass Blob & ResponseCode.Success
          return res;
        }
      })
      // 前台暫時用不到
      // tap((res: any) => {
      //   // show notification if not is auth module
      //   res.responseCode !== ResponseCode.Success &&
      //     !url.includes('Account') &&
      //     this.notifierService.showNotification(NotificationComponent, {
      //       displayMessage: res.errorMessage.message,
      //       buttonText: 'close',
      //       messageType: 'error',
      //       duration: 5000,
      //     });
      // })
    );
  }

  private handlerAuthError(): OperatorFunction<unknown, unknown> {
    return catchError((e: HttpErrorResponse, caught) => {
      const networkErrorCodes = [404, 502, 503, 504];
      const tokenErrorStatus = e.status === 403 || e.status === 401;

      if (tokenErrorStatus) {
        this.storage.clear();
        this.router.navigate(['/Account/Login']);
        return of();
      }

      let statusCode = e.status;
      if (
        networkErrorCodes.some(
          (code) => code === e.status || !window.navigator.onLine
        )
      ) {
        statusCode = 404;
      }

      this.notifierService.showNotification(NotificationComponent, {
        displayMessage: ErrorMessageMap[statusCode]['message'],
        buttonText: 'close',
        messageType: 'error',
        duration: 5000,
      });

      throw e;
    });
  }
}
