import { catchError, finalize, Observable, of, tap } from "rxjs";
import { LOADING_MASK_UTIL } from "./loadingMaskUtilities";

declare module 'rxjs/internal/Observable' {
    interface Observable<T> {
      enqueueForLoadingMask(this: Observable<T>): Observable<T>;
    }
  }

function enqueueForLoadingMask<T>(this: Observable<T>): Observable<T> {
    LOADING_MASK_UTIL.increase();
    return this
    .pipe(finalize(() => LOADING_MASK_UTIL.decrease()));
}
Observable.prototype.enqueueForLoadingMask = enqueueForLoadingMask;