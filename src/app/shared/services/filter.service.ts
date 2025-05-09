/** --------------------------------------------------------------------------------
 *-- Description： filter service
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
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  tap,
} from 'rxjs';
import { DynamicFormValue } from '../../models';

@Injectable({ providedIn: 'root' })
export class FilterService {
  paginationInitialValue = {
    page: 1,
    pageSize: 10,
  };
  filterInitialValue = {};

  private paginationSubject = new BehaviorSubject<{
    page: number;
    pageSize: number;
  }>(this.paginationInitialValue);
  private pagination$ = this.paginationSubject.asObservable();

  private filterSubject = new BehaviorSubject<DynamicFormValue>(
    this.filterInitialValue
  );
  private filter$ = this.filterSubject.asObservable();

  private resetPage = false;

  filterParams$: Observable<any> = combineLatest([
    this.pagination$,
    this.filter$,
  ]).pipe(
    map(([pagination, filter]) => {
      if (this.resetPage) {
        return { ...pagination, ...filter, page: 1 };
      } else {
        return { ...pagination, ...filter };
      }
    }),
    tap(() => {
      this.resetPage = false;
    }),
    debounceTime(500),
    distinctUntilChanged()
  );

  constructor() {}

  /** 分頁切換 */
  pageChange(page: { page: number; pageSize: number }): void {
    this.paginationSubject.next(page);
  }

  /** 篩選條件切換 */
  filterChange(value: any): void {
    this.resetPage = true;
    this.filterSubject.next(value);
  }
}
