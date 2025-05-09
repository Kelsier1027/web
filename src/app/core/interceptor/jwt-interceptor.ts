import { AuthService } from './../../auth/services/auth.service';
import { Router } from '@angular/router';
import {
  HttpRequest,
  HttpInterceptor,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthToken } from '../model/token';
import { JWTOptions } from '../model/option';
import { StorageService } from '../services/storage.service';
import { catchError, filter, switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class JWTInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  private excludedUrlsRegex: RegExp[];
  private excludedUrls = ['.svg'];

  constructor(
    private storage: StorageService,
    private options: JWTOptions,
    private auth: AuthService,
    private router: Router
  ) {
    this.excludedUrlsRegex =
      this.excludedUrls.map((urlPattern) => new RegExp(urlPattern, 'i')) || [];
  }

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    //排除攔截的網址(e.g. svg)
    const passThrough: boolean = !!this.excludedUrlsRegex.find((regex) =>
      regex.test(req.url)
    );

    if (passThrough) {
      return next.handle(req);
    }

    const auth: AuthToken =
      (!!this.options.key && this.storage.get(this.options.key)) || {};

    if (
      Object.keys(auth).length !== 0 &&
      !req.url.includes('login') &&
      !req.url.includes('token_refresh')
    ) {
      req = this.addTokenHeader(req, auth.token);
    }

    return next.handle(req).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(req, next);
        }

        return throwError(() => error);
      })
    );
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.url.includes('auth/token_refresh')) {
      this.storage.clear();
      location.reload();
    }

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const auth: AuthToken =
        (!!this.options.key && this.storage.get(this.options.key)) || {};
      const param = { refresh: auth?.refresh_token };

      if (Object.keys(auth).length !== 0)
        return this.auth.refreshToken(param).pipe(
          filter((access_token) => access_token !== null),
          switchMap((data: any) => {
            this.isRefreshing = false;
            !!this.options.key &&
              this.storage.set(this.options.key, data.result_data);
            this.refreshTokenSubject.next(data.result_data.access_token);

            return next.handle(
              this.addTokenHeader(request, data.result_data.access_token)
            );
          }),
          catchError((err) => {
            this.isRefreshing = false;

            this.storage.clear();
            this.router.navigate(['/Account/Login']).then(() => {
              window.location.reload();
            });
            return throwError(() => err);
          })
        );
      else return next.handle(request);
    }

    return this.refreshTokenSubject.pipe(
      filter((access_token) => access_token !== null),
      take(1),
      switchMap((access_token) =>
        next.handle(this.addTokenHeader(request, access_token))
      )
    );
  }

  private addTokenHeader(
    request: HttpRequest<any>,
    access_token: string | undefined
  ) {
    if (!access_token) return request;

    return request.clone({
      setHeaders: { Authorization: `Bearer ${access_token}` },
    });
  }
}
