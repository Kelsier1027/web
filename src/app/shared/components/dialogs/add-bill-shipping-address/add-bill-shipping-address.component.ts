/** --------------------------------------------------------------------------------
 *-- Description： 變更地址
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { catchError, filter, map, of, switchMap, tap } from 'rxjs';
import { Component, Inject, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddrAction, ResponseCode } from 'src/app/enums';
import { CityArea, ErrorMessage } from 'src/app/models';
import { MemberService } from 'src/app/services';
import { NotifierService } from 'src/app/shared/services';
import { Options } from 'src/app/shared/models';
import { createAddressLengthValidator } from 'src/app/shared/custom-validator/address-length-validator';

@Component({
  selector: 'app-add-bill-shipping-address',
  templateUrl: './add-bill-shipping-address.component.html',
  styleUrls: ['./add-bill-shipping-address.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class AddBillShippingAddressComponent implements OnInit {
  shippingAddressForm!: FormGroup;
  error: ErrorMessage = {
    submitInvalid: false,
    errorMessage: { type: '', message: '' },
  };
  regExps: { [key: string]: RegExp } = {
    word: /^(?=.*[\u4E00-\u9FA5\uF900-\uFA2D]).+$/,
  };
  cities!: Options[];
  areas!: Options[];
  disabledarea : boolean = true;
  cityAreas!: CityArea[];
  addrOverLength = false;

  isLoading: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddBillShippingAddressComponent>,
    private fb: FormBuilder,
    private memberService: MemberService,
    private notifierService: NotifierService
  ) {}

  /** confirm click */
  onSubmit(): void {
    this.shippingAddressForm.markAllAsTouched();
    if (this.shippingAddressForm.valid && !this.addrOverLength) {
      this.isLoading = true;
      const zipCode = this.cityAreas.find(
        (area) => area.area === this.shippingAddressForm.value.area
      );
      const fullAddr =
        (zipCode ? zipCode.zipCode + ' ' : '') +
        this.shippingAddressForm.value.city +
        this.shippingAddressForm.value.area +
        this.shippingAddressForm.value.address;
      this.memberService
        .addrManage({
          password: this.shippingAddressForm.value.password,
          fullAddr: fullAddr,
          action: this.data.action,
        })
        .pipe(catchError(_ => {
          this.isLoading = false;
          return of();
        }))
        .subscribe((resp: any) => {
          this.isLoading = false;
          if (resp.responseCode === ResponseCode.Success) {
            this.dialogRef.close(true);
            this.notifierService.showInfoNotification(
              this.data.action === AddrAction.AddShipAddr
                ? '新增公司地址已申請成功'
                : '新增帳單寄送地址已申請成功'
            );
          } else {
            this.error.submitInvalid = true;
            this.error.errorMessage = resp.errorMessage;
          }
        });
    }
  }

  ngOnInit(): void {
    this.shippingAddressForm = this.fb.group({
      city: ['', Validators.compose([Validators.required])],
      area: ['', Validators.compose([Validators.required])],
      address: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.regExps['word']),
          createAddressLengthValidator(15)
        ]),
      ],
      password: ['', Validators.compose([Validators.required])],
    });

    this.memberService.getCity().subscribe((res) => {
      if (res.responseCode === ResponseCode.Success) {
        this.cities = res.result.data.map((data) => {
          return { label: data.city, value: data.city };
        });
      }
    });

    this.shippingAddressForm
      .get('city')
      ?.valueChanges.pipe(
        tap(res => {
          if(res != null){
            this.disabledarea = false;
          }else{
            this.disabledarea = true;
          }
        }),
        switchMap((city) => this.memberService.getCityArea(city)),
        filter((res) => res.responseCode === ResponseCode.Success),
        tap((res) => {
          this.cityAreas = res.result.data;
        }),
        map((res) => {
          return res.result.data.map((data) => {
            return { label: data.area, value: data.area };
          });
        })
      )
      .subscribe((areas) => {
        this.areas = areas;
      });
  }
  cityChange(){
    this.areas = [];
  }
  checkAddrLength(event : number){
    if(event > 45){
      this.addrOverLength = true;
    }else{
      this.addrOverLength = false;
    }
  }
}
