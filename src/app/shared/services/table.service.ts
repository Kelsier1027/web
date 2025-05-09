/** --------------------------------------------------------------------------------
 *-- Description： table service
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Injectable } from '@angular/core';
import { Observable, tap, switchMap, catchError, of, filter } from 'rxjs';
import { Pagination } from 'src/app/core/model';
import { ResponseCode } from 'src/app/enums';
import { FilterService } from './filter.service';

type ListHanlder = (data: any, index: number) => any[];

@Injectable({
  providedIn: 'root',
})
export class TableService {
  list!: any[];
  pagination?: Pagination;
  constructor(private filterService: FilterService) {}

  /** filter subfactory */
  filterSubFactory(
    apiFunc: (param: any) => Observable<any>,
    listHandler: ListHanlder
  ) {
    return this.filterService.filterParams$.pipe(
      tap(() => this.initialTable()),
      switchMap((param) => apiFunc(param).pipe(catchError(() => of()))),
      filter(
        (res) => res.responseCode === ResponseCode.Success && res.result.data
      ),
      tap((res) => {
        this.list = res.result.data.map(listHandler);
        this.pagination = res.result.pagination;
      })
    );
  }

  /** initial table */
  private initialTable(): void {
    this.list = [];
    this.pagination = undefined;
  }
}
