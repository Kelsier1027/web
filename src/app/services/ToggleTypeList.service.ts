import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToggleTypeListService{

  constructor() {}
  private isShowTypeList = new BehaviorSubject<boolean>(false);

  state$ = this.isShowTypeList.asObservable();

  updateState(isShow: boolean): void {
    this.isShowTypeList.next(isShow);
  }
}
