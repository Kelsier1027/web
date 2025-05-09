import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {ErrorMessage } from 'src/app/models';
import { ActivatedRoute, Router } from '@angular/router';
import { MemberService } from 'src/app/services';
import { NotifierService } from 'src/app/shared/services';
import { URL_UTIL } from 'src/app/shared/utils/urlUtilities';

@Component({
  selector: 'app-dealer-view',
  templateUrl: './dealer-view.component.html',
  styleUrls: ['./dealer-view.component.scss']
})
export class DealerViewComponent implements OnInit {

  thisTax='';
  dealerViewForm!: FormGroup;
  error: ErrorMessage = {
    submitInvalid: false,
    errorMessage: { type: '', message: '' },
  };
  regExps: { [key: string]: RegExp } = {
    word: /^(?=.*[\u4E00-\u9FA5\uF900-\uFA2D]).+$/,
    tel: /^[\d!@#\$%\^\&*\)\(+=._-]{1,40}$/,
    mobile: /^[\d]{1}[\d-]{1,39}$/,
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DealerViewComponent>,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private memberService: MemberService,
    private notifierService: NotifierService
  ) {}

 /** confirm click */
 onSubmit(): void {

  this.dealerViewForm.markAllAsTouched();
  if (this.dealerViewForm.invalid)
    return;

  const taxReference = this.dealerViewForm.value.taxIdNumber;

  // 檢查是否可用經銷商檢視功能
  this.memberService
  .getTaxReference(taxReference).subscribe((result) => {
    if (result.responseCode=='0000') {
      this.thisTax = taxReference;
      // 如果 API 回傳可用，依據關鍵字有沒有填，跳轉至對應的頁面
      // |- 關鍵字有填：商品列表
      // +- 關鍵字未填：訂單查詢或是原地（若目前頁面支援的話）
      if (this.dealerViewForm.value.keyword?.length)
        this.router.navigate(['/ProductList'], { queryParams: 
      { 
        dealerView: this.dealerViewForm.value.taxIdNumber, 
        keyword: this.dealerViewForm.value.keyword ?? ' ' 
      } });
      else {
        const route = this.isCurrentlyInSupportedRoute()
          ? []
          : ['/Member/Order']
        this.router.navigate(route, { queryParams: { 
          ...this.route.snapshot.queryParams,
          dealerView: this.dealerViewForm.value.taxIdNumber 
        } });
      }
      this.dialogRef.close(this.dealerViewForm.value);
    } else {
      this.notifierService.showInfoNotification(result.responseMessage);
    }
  });
}
  ngOnInit(): void {
    const eightDigitPattern = '^[0-9]{8}$';
    this.dealerViewForm = this.fb.group({
      taxIdNumber: [null,
        Validators.compose([
          Validators.required,
          Validators.pattern(eightDigitPattern), //只能八位數字
        ]),
      ],      
      keyword: null
    });
  }

  getNoKeywordHint(): string {
    // 依據現在所在頁面是否支援檢視經銷商，調整跳轉行為的說明
    if (this.isCurrentlyInSupportedRoute())
      return "以經銷商視點檢視當前頁面";

    return "跳轉至該經銷商之訂單查詢";
  }

  isCurrentlyInSupportedRoute(): boolean {
    // 現在是否正位於可使用檢視經銷商功能的頁面
    return URL_UTIL.canUseDealerView(this.router.routerState.snapshot);
  }

}
