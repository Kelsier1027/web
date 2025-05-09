import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogAction } from 'src/app/enums';
import { MemberService } from 'src/app/services';
import { DialogService } from 'src/app/shared/services';

@Component({
  selector: 'app-product-directions',
  templateUrl: './product-directions.component.html',
  styleUrls: ['./product-directions.component.scss'],
})
export class ProductDirectionsComponent implements OnInit {
  content = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ProductDirectionsComponent>,
    public dialogservice: DialogService,
    public memberService: MemberService
  ) {}

  ngOnInit(): void {
    this.memberService.getTermsAndConditions(4).subscribe((resp) => {
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
    this.dialogRef.close({ action: DialogAction.Save });
  }

  add(): void {
  }
}
