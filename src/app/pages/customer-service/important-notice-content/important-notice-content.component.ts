import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { catchError, of, Subscription, switchMap, tap } from 'rxjs';
import { Pagination } from 'src/app/core/model';
import { DialogService, LayoutService } from 'src/app/shared/services';
import { FilterService } from 'src/app/shared/services/filter.service';
import { ProductService } from 'src/app/services';
import { ResponseCode } from 'src/app/enums';
import { MemberService } from 'src/app/services';
import { PromoHomeItem } from 'src/app/models';
import { AuthService } from 'src/app/auth/services/auth.service';
import { EnvConfig } from 'src/app/app.module';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-important-notice-content',
  templateUrl: './important-notice-content.component.html',
  styleUrls: ['./important-notice-content.component.scss']
})
export class ImportantNoticeContentComponent implements OnInit {
  filterForm!: FormGroup;
  isCreatedByCurrentUser!: boolean;
  dataSource!: any;
  pagination?: Pagination;
  filterSub = new Subscription();

  itemToSelectContent = '';
  data = [
    {
      id: "1",
      status: "訂單查詢",
      name: "訂單狀態說明",
      time: "2022/10/12",
    }
  ];

  config: any;
  p: number = 1;
  isLoading = true;
  isHomePage!: boolean;
  isCategoryLayout!: boolean;
  currentScreenSize: string = '';
  searchQuery: string = '';
  selectedItem: any | null = null;
  dataContent = true;

  constructor(
    private envConfig: EnvConfig,
    private authService: AuthService,
    private productService: ProductService,
    public dialogservice: DialogService,
    public layoutService: LayoutService,
    private fb: FormBuilder,
    private filterService: FilterService,
    private memberService: MemberService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {

    //this.data=[];

    this.authService.getBulletin(this.envConfig.orgId).subscribe((resp: any) => {
      // Assuming resp.responseCode === ResponseCode.Success before proceeding
      if (resp.responseCode === '0000') {
        // Set this.data to the response data
        this.data = resp.result.items.map((item: any) => ({
          itemId: item.id,
          status: item.typeName,
          name: item.title,
          time: new Date(item.announceDate).toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' })
        }));
      }
    });

    this.route.queryParams.subscribe(params => {
      const itemId: string = params['itemId'];

      if (itemId) {
        // Find the item in your data array based on the itemId
        const itemToSelect = this.data.find(item => item.id === itemId);
        this.itemToSelectContent = '';

        if (itemToSelect) {
          this.authService.getBulletinDetail(Number(itemId)).subscribe((resp: any) => {
            // Assuming resp.responseCode === ResponseCode.Success before proceeding
            if (resp.responseCode === '0000') {
              // Set this.data to the response data
              this.itemToSelectContent = resp.result.content;
            }
          });

          // Expand the corresponding item
          this.selectedItem = itemToSelect;
          this.dataContent = false;
        }
      } else {
        // No itemId parameter, don't expand any item by default
        //this.dataContent = false;
        //this.selectedItem = null;
      }
    });

  }

  loadContentManagementDetail(itemId: string) {


      if (itemId) {
        // Find the item in your data array based on the itemId
        const itemToSelect = this.data.find(item => item.id === itemId);
        this.itemToSelectContent = '';


          this.authService.getBulletinDetail(Number(itemId)).subscribe((resp: any) => {
            // Assuming resp.responseCode === ResponseCode.Success before proceeding
            if (resp.responseCode === '0000') {
              // Set this.data to the response data
              this.itemToSelectContent = resp.result.content;
            }
          });
        
      } 

  }
  loadContentManagement() {
    this.filterSub = this.filterService.filterParams$
      .pipe(
        switchMap((param) => {
          return this.productService.getFlashSaleomeList(param).pipe(
            catchError(() => {
              // handle api error and continue operation
              return of();
            })
          );
        }),

        tap((res) => {
          if (res.responseCode === '0000' && Array.isArray(res.result)) {
            this.pagination = res.result.pagination;
            const promoHomeItemList = res.result as PromoHomeItem[];
            if (Array.isArray(promoHomeItemList)) {             
            }
          } else {
          }
        })
      )
      .subscribe();
  }

  toggleMenuType(isCategoryLayout: boolean) {
    this.isCategoryLayout = isCategoryLayout;
  }

  toggleContent(item: any): void {
    item.isContentVisible = !item.isContentVisible;
  }

  toggleDataContent(item: any): void {
    this.dataContent = !this.dataContent;
    if (this.selectedItem === item) {
      this.selectedItem = null;
    } else {

      this.selectedItem = item;
      this.loadContentManagementDetail(item.itemId);
    }
  }
}
