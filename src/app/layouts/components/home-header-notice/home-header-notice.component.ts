/** --------------------------------------------------------------------------------
 *-- Description： 首頁通知
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
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

@Component({
  selector: 'app-home-header-notice',
  templateUrl: './home-header-notice.component.html',
  styleUrls: ['./home-header-notice.component.scss'],
})
export class HomeHeaderNoticeComponent implements OnInit {
  data = [
    {
      id: "訂單查詢",
      type: 1,
      typeName:"2022/10/12",
      title:"2022/10/12",
      announceDate:"2022/10/12",
    }]
  constructor(private envConfig: EnvConfig,
    private authService: AuthService,
    private productService: ProductService,
    public dialogservice: DialogService,
    public layoutService: LayoutService,
    private fb: FormBuilder,
    private filterService: FilterService,
    private memberService: MemberService) { 

      
    }

  ngOnInit(): void {

    this.data=[];

    this.authService.getBulletin(this.envConfig.orgId).subscribe((resp: any) => {
      // Assuming resp.responseCode === ResponseCode.Success before proceeding
      if (resp.responseCode === '0000') {
        // Set this.data to the response data
        this.data = resp.result.items.map((item: any) => ({
          id: item.id,
          type:item.type,
          typeName:item.typeName,
          title:item.title,
          announceDate:item.announceDate,          
        }));
      }
    });
  }

  getColStyle(): string {
    const type: number = this.data[0]?.type;

    switch (type)
    {
      // 異常處理中
      case 4:
        return 'notice-col error';
      // 已排除異常
      case 5:
        return 'notice-col fixed';
      // 其他，用基本格式
      default:
        return 'notice-col';
    }
  }
}
