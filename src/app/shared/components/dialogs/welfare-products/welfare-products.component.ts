import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogAction } from 'src/app/enums';
import { MemberService } from 'src/app/services';
import { DialogService } from 'src/app/shared/services';

@Component({
  selector: 'app-welfare-products',
  templateUrl: './welfare-products.component.html',
  styleUrls: ['./welfare-products.component.scss'],
})
export class WelfareProductsComponent implements OnInit {

  content = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<WelfareProductsComponent>,
    public dialogservice: DialogService,
    public memberService: MemberService
  ) {}

  ngOnInit(): void {
    this.memberService.getTermsAndConditions(3)
    .subscribe((resp) => {
      this.content = resp.result.htmlText;
    })
  }
  /** cancel click */
  cancel(): void {
    this.dialogRef.close({ action: DialogAction.Cancel });
  }

  /** confirm click */
  save(): void {
    this.data.confirm();
    this.dialogRef.close({ action: DialogAction.Cancel });
  }

  add(): void {
  }
}
