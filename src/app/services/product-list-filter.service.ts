import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductListFilterService{

  constructor() {}
  private isFilterType = new BehaviorSubject<String>('A'); //無法放置空字串因為最新上架的排序是判斷是否為空字串，這樣會造成Bug所以在這邊放置A。

  state$ = this.isFilterType.asObservable();

  ChangeFilter(isType: String): void {
    this.isFilterType.next(isType);
  }
}
