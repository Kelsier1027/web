import { Component, Inject, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, filter, map, of, switchMap } from 'rxjs';
import { LocalStorage } from 'src/app/core/model/Istorage';
import { ResponseCode } from 'src/app/enums';
import { LayoutEnum } from 'src/app/enums/layout.enum';
import { ProductService, AnalyticsService } from 'src/app/services';
import { ORG_ID } from '../../utils/basicInfoUtilities';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  @Input() links!: { name: string; url: string; queryParams?: Params | null; }[];
  @Input() linkOnly?: boolean;
  breadCrumbs$!: Observable<{ name: string; url: string; queryParams?: Params | null; }[]>;
  orgName: string = "精技電腦";

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private analyticsService: AnalyticsService,
    private titleService: Title
  ) {
  }

  ngOnInit(): void {    
    this.orgName = ORG_ID.getOrgName();

    this.breadCrumbs$ = this.activatedRoute.queryParams.pipe(
      switchMap((param) => {
        // 商品頁的名稱由商品頁自己處理，所以這裡在吃到預設值前就提早返回
        if (param['itemId']) {
          return of(this.links);
        }

        // 預設值，避免意外情況或讀取中時變回上一頁的值
        this.titleService.setTitle(this.orgName);

        // 關鍵字搜尋
        if (param['keyword']) {
          this.titleService.setTitle(`「${param['keyword']}」搜尋結果 - ${this.orgName}`);
          return of([{ name: '搜尋', url: '' }]);
        } 
        
        // 福利品頁
        if (param['isWelfare']) {
          this.titleService.setTitle(`福利品 - ${this.orgName}`);
          return of([{ name: '福利品', url: '' }]);
        } 

        // 會員中心系列
        if (this.activatedRoute.snapshot.data['navCategory'] == LayoutEnum.Member) {
          const name = this.activatedRoute.snapshot.data['name'];
          const isMember = name == '會員中心';
          const newTitle = [
            '會員中心',
            isMember ? '' : `> ${name}`,
            `- ${this.orgName}`
          ].join(' ');

          this.titleService.setTitle(newTitle);
          return of([{ name: '會員中心 > ' + this.activatedRoute.snapshot.data['name'], url: '' }]);
        }

        // 上述情況都不符合時，當成商品列表來處理
          return this.productService.getMenu().pipe(
            filter((res) => res.responseCode === ResponseCode.Success),
            map((res) => {
              return res.result.type1List.reduce(
                (group: { name: string; url: string; queryParams?: Params }[], type1) => {
                  if (type1.id === +param['type1Id']) {
                    group.push({ name: type1.name, url: '/', queryParams: { type1Id: null, type2Id: null, brand: null } });

                    const type2 = type1.type2List.find(
                      (type2) => type2.id === +param['type2Id']
                    );
                    if (type2) {
                      group.push({
                        name: type2.name,
                        url: `/ProductList`,
                        queryParams: { brand: null }
                      });
                      const brand = type2.brandList.find(
                        (brand) => brand.id === +param['brand']
                      );
                      if (brand) {
                        group.push({
                          name: brand.name,
                          url: '/ProductList'
                        });
                      }
                    }


                    const type1Name = group[0]?.name;
                    const type2Name = group[1]?.name;
                    const brandName = group[2]?.name;

                    this.analyticsService.event("product_list", {
                      type1Name: type1Name,
                      type2Name: type2Name,
                      brandName: brandName
                    });

                    const newTitle = [type1Name, type2Name, brandName]
                      .filter(s => s)
                      .join(' > ')
                    this.titleService.setTitle(`${newTitle} - ${this.orgName}`);
                  }
                  return group;
                },
                []
              );
            })
          );
      })
    );
  }
}
