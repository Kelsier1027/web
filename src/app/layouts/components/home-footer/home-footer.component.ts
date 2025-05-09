/** --------------------------------------------------------------------------------
 *-- Description： 首頁Footer
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/shared/services/layout.service';
import { DialogService } from 'src/app/shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { StorageService } from 'src/app/core/services/storage.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { EnvConfig } from 'src/app/app.module';
import { URL_UTIL } from 'src/app/shared/utils/urlUtilities';

@Component({
  selector: 'app-home-footer',
  templateUrl: './home-footer.component.html',
  styleUrls: ['./home-footer.component.scss'],
})
export class HomeFooterComponent implements OnInit {
  urljingho: any;
  urldchain: any;
  thisOrgId: any;
  year!: number;
  currentScreenSize: string = '';
  options = [
    {
      key: 1,
      label: '獎勵好康',
      active: false,
      hiddenForSales: true,
      child: [
        {
          url: '/Member/Bonus',
          label: '紅利查詢',
          hiddenIfNoShowBonus: true
        },
        {
          url: '/Member/Prize',
          label: '待領贈品',
        },
      ],
    },
    {
      key: 2,
      label: '訂單物流',
      active: false,
      hiddenForSales: true,
      child: [
        {
          url: '/Member/Order',
          label: '訂單查詢',
        },
        {
          url: '/Member/Bill',
          label: '帳單查詢',
        },
        {
          url: '/Member/StockNotice',
          label: '貨到通知',
        },
      ],
    },

    {
      key: 3,
      label: '客服中心',
      active: false,
      hiddenForSales: false,
      child: [
        {
          url: '/CustomerService/CommonProblom',
          label: 'iOrder小幫手',
        },
        {
          url: '/CustomerService/ImportantNotice',
          label: '重要公告',
        },
      ],
    },
    {
      key: 4,
      label: '會員權益',
      active: false,
      hiddenForSales: false,
      child: [
        {
          url: '',
          label: '會員同意書',
        },
        {
          url: '',
          label: '網路下單條款',
        },
      ],
    },
  ];
  constructor(
    public layoutService: LayoutService,
    private dialogservice: DialogService,
    private router: Router,
    private envConfig: EnvConfig,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const loginGuide = this.envConfig.loginGuide;
    const jingjiComputer = loginGuide.find(item => item.title === '精技電腦');
    if (jingjiComputer) {
      this.urldchain = jingjiComputer.url;
    }
    const jinghoComputer = loginGuide.find(item => item.title === '精豪電腦');
    if (jinghoComputer) {
      this.urljingho = jinghoComputer.url;
    }
    this.thisOrgId = localStorage.getItem('orgId');
    this.year = new Date().getFullYear();
    this.reorderOptionsBasedOnRoute();
  }

  /** click */
  handleClick(idx: number): void {
    this.options[idx].active = !this.options[idx].active;
  }

  openDialog(label: string) {
    let modelOption: any = {
      modelName: 'internet-trading-terms',
      config: {
        data: {
          title: '網路下單條款',
          titleStyle: {
            width: '100%',
            'margin-left': '32px',
          },
        },
        width: '820px',
        height: '500px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: '',
      },
    };
    if (label === '會員同意書') {
      modelOption = {
        modelName: 'terms-of-service',
        config: {
          data: {
            title: '會員約定同意書',
            StyleWidthFooter: '430px',
          },
          width: '820px',
          height: '600px',
          hasBackdrop: true,
          autoFocus: false,
          enterAnimationDuration: '300ms',
          exitAnimationDuration: '300ms',
          panelClass: 'terms-of-service-dialog',
        },
      };
    }

    this.dialogservice.openLazyDialog(
      modelOption.modelName,
      modelOption.config
    );
  }

  reorderOptionsBasedOnRoute(): void {
    const currentRoute = this.router.url;
    if (
      currentRoute === '/CustomerService/ImportantNotice' ||
      currentRoute === '/CustomerService/CommonProblom'
    ) {
      const reorderedOptions = ['獎勵好康', '訂單物流', '客服中心', '會員權益']
        .map((label) => this.options.find((option) => option.label === label))
        .filter((option) => option !== undefined) as typeof this.options;

      if (reorderedOptions.length === this.options.length) {
        this.options = reorderedOptions;
      }
    }
  }

  getDealerView(targetRoute: string): string | null {
    if (!URL_UTIL.canUseDealerView(targetRoute))
      return null;
    
    return URL_UTIL.getDealerView(this.route.snapshot);
  }

  isJingHo(): boolean {
    return this.thisOrgId == '151';
  }

  isSales(): boolean {
    return JSON.parse(localStorage.getItem('isSales') ?? 'true');
  }

  displayBonus(): boolean {
    return JSON.parse(localStorage.getItem('displayBonus') ?? 'false');
  }
}
