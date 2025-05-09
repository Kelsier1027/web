/** --------------------------------------------------------------------------------
 *-- Description： 我的追蹤
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormGroupDirective,
} from '@angular/forms';
import { catchError, concat, filter, of, Subject, Subscription, switchMap, take, tap } from 'rxjs';
import { Pagination } from 'src/app/core/model';
import { ResponseCode } from 'src/app/enums';
import { Trace } from 'src/app/models';
import { MemberService } from 'src/app/services';
import { DialogService, NotifierService } from 'src/app/shared/services';
import { FilterService } from 'src/app/shared/services/filter.service';
import { LayoutService } from 'src/app/shared/services/layout.service';
import { environment } from 'src/environments/environment';
import { Options } from 'src/app/shared/models';
import { ScrollService } from 'src/app/services/scroll.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.scss'],
})
export class WishListComponent implements OnInit {
  dataChange = new EventEmitter();
  dataSource!: any;
  traceList!: Trace[];
  traceListMobile: Trace[] = [];
  maxSize: number = 10;
  filterForm!: FormGroup;
  isCreatedByCurrentUser!: boolean;
  //dataSource!: any;
  pagination?: Pagination;
  filterSub = new Subscription();
  layoutChanges$ = new Subject();
  paginationForm!: FormGroup;
  active!: string;
  expireSoon!: number;
  inActive!: string;
  used!: string;
  thispage = 1;
  totalpage = 0;
  mobilepage = 0; //於手機版時累加用的
  isLoadmobileData = false;
  fistLoadmobileData = true;
  paginateArgs: any = {
    itemsPerPage: 10,
    currentPage: this.pagination?.currentPage ?? 1,
    totalItems: 0,
  };
  selectedPageSize = 10;
  pageSizeOption: Options[] = [
    {
      label: '10筆',
      value: 10,
    },
    {
      label: '20筆',
      value: 20,
    },
    {
      label: '30筆',
      value: 30,
    },
    {
      label: '40筆',
      value: 40,
    },
  ];

  constructor(
    public layoutService: LayoutService,
    private filterService: FilterService,
    private memberService: MemberService,
    private notifierService: NotifierService,
    public dialogservice: DialogService,
    private scrollService:ScrollService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.filterSub = this.filterService.filterParams$
      .pipe(
        switchMap((param) =>
          this.memberService.getWishList(param).pipe(
            catchError(() => {
              // handle api error and continue operation
              return of();
            })
          )
        ),
        tap((res) => {
          if (res.responseCode === ResponseCode.Success) {
            const pagination = res.result.pagination ?? {}; // 獲取 pagination 對象，如果不存在則默認為一個空對象
            this.pagination = pagination;

            this.totalpage = this.pagination?.totalPage ?? 0;

            this.paginateArgs.itemsPerPage = this.pagination?.pageSize;
            this.paginateArgs.currentPage = this.pagination?.currentPage ?? 1;
            this.paginateArgs.totalItems = this.pagination?.total;
            if (
              this.pagination?.totalPage &&
              this.pagination.totalPage > this.thispage
            ) {
              this.pagination.currentPage = this.thispage;
            } else {
              if (this.pagination) {
                this.pagination.currentPage = 1;
              }
            }
            //this.pagination = res.result.pagination;
            //this.traceList = res.result.traceList;
            //this.dataSource = this.traceList;

            if (Array.isArray(res.result.traceList)) {
              this.dataSource = res.result.traceList;
              this.traceList = res.result.traceList;
            }
          }
        })
      )
      .subscribe();

      this.layoutService.layoutChanges$.pipe(
      ).subscribe((layoutSize) => {
        if(layoutSize === 'small'){
          this.scrollService.scrollRatio$.subscribe(data => {
            if(this.router.url == '/Member/Wishlist'){
              if(this.fistLoadmobileData){
                this.isLoadmobileData = true
                this.fistLoadmobileData = false;
                this.mobilepage++;
                this.loadwishList();
              }
              if (data >= 0.3 && this.isLoadmobileData == false) {
                this.isLoadmobileData = true
                this.mobilepage++;
                if(this.mobilepage <= this.totalpage){
                  this.loadwishList();
                }
              }
            }
          });
        }else{
          this.mobilepage = 0;
          this.fistLoadmobileData = true;
          this.traceListMobile = [...this.traceList];
        }
      });
  }
  loadwishList(){
    this.memberService
    .getWishList({page: this.mobilepage, pageSize: 10})
    .pipe(
      catchError(() => {
        return of();
      })
    )
    .pipe(
      tap((res) => {
        if (res.responseCode === ResponseCode.Success) {
          if (Array.isArray(res.result.traceList)) {
            this.traceListMobile.push(...res.result.traceList);
          }
        }
      })
    ).subscribe(()=>this.isLoadmobileData = false);
  }
  /** 分頁切換 */
  onPageChange(page: number): void {
    this.filterService.pageChange({
      page: page,
      pageSize: this.pagination?.pageSize!,
    });
  }
  pageSizeChange($event: number) {
    this.maxSize = $event;
    this.selectedPageSize = $event;
    this.dataChange.emit({ pageSize: $event });
    this.filterService.pageChange({
      page: 1,
      pageSize: this.selectedPageSize,
    });
  }

  /** 移除追蹤 */
  handleDelModal(id: number): void {
    this.memberService.deleteWishList(id).subscribe((res) => {
      if (res.responseCode === ResponseCode.Success) {
        this.notifierService.showInfoNotification('商品已移除追蹤');
        this.filterService.pageChange({
          page: 1,
          pageSize: this.pagination?.pageSize!,
        });
      }
    });
  }

  /** open 貨到通知 modal */
  arrivalNoticeDialog(itemId: number, itemName: string, itemNumber: string) {
    const modelOption = {
      modelName: 'arrival-notice',
      config: {
        data: {
          title: '貨到通知',
          StyleMargin: '0px',
          text: '目前庫存已完售 (暫無確切交期)，若有需求請洽業務排單，待貨到後再行通知。謝謝！',
          isIcon: false,
          itemId: itemId,
          itemName: itemName,
          itemSeg: itemNumber,
        },
        width: '500px',
        height: '654px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: '',
      },
    };

    this.dialogservice.openLazyDialog(
      modelOption.modelName,
      modelOption.config
    );
  }

  /** open 請洽業務 modal */
  contactBusinessDialog(itemNumber: string, itemName: string) {
    const modelOption = {
      modelName: 'contact-business',
      config: {
        data: {
          title: '請洽業務',
          StyleMargin: '0px',
          text: '',
          isIcon: false,
          itemNumber: itemNumber,
          itemName: itemName,
        },
        width: '500px',
        height: '356px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: '',
      },
    };

    this.dialogservice.openLazyDialog(
      modelOption.modelName,
      modelOption.config
    );
  }
}
