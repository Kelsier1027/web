import { Injectable } from '@angular/core';
import { HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpDefaultOptions, HttpRequestOptions } from '../model/option';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseService {
  whenErrorResume$ = new BehaviorSubject(null);
  constructor(
    protected http: HttpClient,
    protected options: HttpDefaultOptions
  ) {}

  protected get<T>(
    url: string,
    httpOptions?: HttpRequestOptions
  ): Observable<T> {
    return this.httpProcess(url, httpOptions, (fullURL: any, options: any) =>
      this.http.get(fullURL, options)
    );
  }

  protected patch<T>(
    url: string,
    httpOptions?: HttpRequestOptions
  ): Observable<T> {
    return this.httpProcess(
      url,
      httpOptions,
      (fullURL: any, options: any, body: any) =>
        this.http.patch(fullURL, body, options)
    );
  }

  protected post<T>(
    url: string,
    httpOptions?: HttpRequestOptions
  ): Observable<T> {
    return this.httpProcess(
      url,
      httpOptions,
      (fullURL: any, options: any, body: any) =>
        this.http.post(fullURL, body, options)
    );
  }

  protected put<T>(
    url: string,
    httpOptions?: HttpRequestOptions
  ): Observable<T> {
    return this.httpProcess(
      url,
      httpOptions,
      (fullURL: any, options: any, body: any) =>
        this.http.put(fullURL, body, options)
    );
  }

  protected delete<T>(
    url: string,
    httpOptions?: HttpRequestOptions
  ): Observable<T> {
    return this.httpProcess(url, httpOptions, (fullURL: any, options: any) =>
      this.http.delete(fullURL, options)
    );
  }

  protected toURLParams(obj: any) {
    let params = new HttpParams();
    for (const key in obj) {
      params = params.set(key, obj[key] ? obj[key].toString() : obj[key]);
    }
    return params;
  }

  protected setHeaders(headers: any): HttpHeaders {
    let httpHeaders = new HttpHeaders();
    headers = Object.assign(headers || {}, this.options.headers);
    for (const key in headers) {
      httpHeaders = httpHeaders.set(key, headers[key].toString());
    }
    return httpHeaders;
  }

  private httpProcess(
    url: any,
    httpOptions: HttpRequestOptions = {},
    httpFunc: any
  ) {
    // const fullURL = url.toURL(httpOptions.baseURL || this.options.baseApiURL);
    const fullURL = this.options.baseApiURL + url;
    const body = httpOptions.body;
    const params = this.toURLParams(httpOptions.queryObject);
    const headers = this.setHeaders(httpOptions.headers);
    return httpFunc(
      fullURL,
      { params, headers, responseType: httpOptions.responseType },
      body
    );
  }
}
