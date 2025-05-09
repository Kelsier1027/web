/** --------------------------------------------------------------------------------
 *-- Description： page滾動service
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  constructor() {}
  private dataSubject = new BehaviorSubject<any>(null);
  scrollRatio$ = this.dataSubject.asObservable();
  setScrollRatio(ScrollRatio:any){
    this.dataSubject.next(ScrollRatio);
  }
}
