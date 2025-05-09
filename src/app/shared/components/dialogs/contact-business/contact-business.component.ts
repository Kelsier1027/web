import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, catchError, filter, map, of } from 'rxjs';
import { DialogAction, ResponseCode } from 'src/app/enums';
import { Sales } from 'src/app/models';
import { ProductService } from 'src/app/services';
import { NotifierService } from 'src/app/shared/services';

@Component({
  selector: 'app-contact-business',
  templateUrl: './contact-business.component.html',
  styleUrls: ['./contact-business.component.scss'],
})
export class ContactBusinessComponent implements OnInit {
  apiResponse!: Observable<Sales>;
  isLoading: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ContactBusinessComponent>,
    private productService: ProductService,
    private notifierService: NotifierService
  ) {}
  ngOnInit(): void {
    this.apiResponse = this.productService.getSalesInfo().pipe(
      filter((res) => res.responseCode === ResponseCode.Success),
      map((res) => res.result)
    );
  }

  /** cancel click */
  cancel(): void {
    this.dialogRef.close({ action: DialogAction.Cancel });
  }

  /** confirm click */
  save(): void {
    this.isLoading = true;
    this.productService
      .contactMe({
        itemNumber: this.data.itemNumber,
        itemName: this.data.itemName,
      })
      .pipe(catchError(_ => {
        this.isLoading = false;
        return of();
      }))
      .subscribe((res) => {
        this.isLoading = false;
        if (res.responseCode === ResponseCode.Success) {
          this.notifierService.showInfoNotification(res.result);
          this.dialogRef.close({ action: DialogAction.Save });
        }
      });
  }
}
