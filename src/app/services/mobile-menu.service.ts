import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { indexBy, prop } from 'ramda';
import { BehaviorSubject, Subject, combineLatest, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MobileMenuService {

  constructor(private activatedRoute: ActivatedRoute) { }

  menuData = new Subject<{
    [index: string]: { type2List: any[] }
  }>();

  title = new Subject<any[]>()
  title$ = combineLatest([
    this.activatedRoute.queryParams,
    this.title.asObservable(),
  ]).pipe(
    map(([routeParams, menuList]) => {
      return menuList.find((item) => item.id === Number(routeParams['type2Id']))?.name
    })
  )

  setMenuData(data: any) {
    this.menuData.next(indexBy<any, number>(prop('id'))(data))
  }
}
