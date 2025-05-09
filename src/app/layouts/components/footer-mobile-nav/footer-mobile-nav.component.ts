/** --------------------------------------------------------------------------------
 *-- Description： Footer Mobile Navigator
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject, filter, startWith, takeUntil } from 'rxjs';
import { GlobalStateService } from 'src/app/core/services/global-state.service';
import { LayoutEnum } from 'src/app/enums/layout.enum';

@Component({
  selector: 'app-footer-mobile-nav',
  templateUrl: './footer-mobile-nav.component.html',
  styleUrls: ['./footer-mobile-nav.component.scss'],
})
export class FooterMobileNavComponent implements OnInit, OnDestroy {
  readonly LayoutEnum = LayoutEnum;
  navCategory: LayoutEnum | null = null;
  subnavCategory: string = '';
  unsubscribe$ = new Subject<void>();
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private globalStateService: GlobalStateService
  ) {
  }

  ngOnInit(): void {
    this.router.events
      .pipe(
        startWith(null),
        filter((event) => !event || event instanceof NavigationEnd),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(() => this.onToggleOpenFixedNav(null));

    this.globalStateService.isOpenFixedNav$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((openFixedNav) => {
        this.navCategory =
          openFixedNav ||
          (this.route.snapshot['data']['navCategory'] as LayoutEnum);
        this.subnavCategory = this.route.snapshot.url.join('/');
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onToggleOpenFixedNav(
    openFixedNav: LayoutEnum.RecentlyViewed | LayoutEnum.Category | null
  ) {
    this.globalStateService.isOpenFixedNav$.next(openFixedNav);
  }

  isSales(): boolean {
    return JSON.parse(localStorage.getItem('isSales') ?? 'true');
  }
}
