/** --------------------------------------------------------------------------------
 *-- Description： 新增常用指送地址
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, Inject, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { filter, map, switchMap, tap } from 'rxjs';
import { ResponseCode } from 'src/app/enums';
import { CityArea, CommonAddress, ErrorMessage } from 'src/app/models';
import { MemberService } from 'src/app/services';
import { createAddressLengthValidator } from 'src/app/shared/custom-validator/address-length-validator';
import { Options } from 'src/app/shared/models';
import { NotifierService } from 'src/app/shared/services';

@Component({
  selector: 'app-create-address',
  templateUrl: './create-address.component.html',
  styleUrls: ['./create-address.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class CreateAddressComponent implements OnInit {
  createAddressForm!: FormGroup;
  error: ErrorMessage = {
    submitInvalid: false,
    errorMessage: { type: '', message: '' },
  };
  regExps: { [key: string]: RegExp } = {
    word: /^(?=.*[\u4E00-\u9FA5\uF900-\uFA2D]).+$/,
    tel: /^[\d!@#\$%\^\&*\)\(+=._-]{1,40}$/,
    mobile: /^[\d]{1}[\d-]{1,39}$/,
  };
  cities!: Options[];
  areas!: Options[];
  disabledarea : boolean = true;
  cityAreas!: CityArea[];
  addrOverLength = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateAddressComponent>,
    private fb: FormBuilder,
    private memberService: MemberService,
    private notifierService: NotifierService
  ) {}

  /** confirm click */
  onSubmit(): void {
    const isEdit = !!this.data.oldData;
    this.createAddressForm.markAllAsTouched();
    if (this.createAddressForm.valid && !this.addrOverLength) {
      const zipCode = this.cityAreas.find(
        (area) => area.area === this.createAddressForm.value.addrCityArea
      );
      const api = isEdit
        ? this.memberService.editCommonAddress(this.data.oldData.id, {
            ...this.createAddressForm.value,
            addrZipCode: zipCode?.zipCode,
          })
        : this.memberService.addCommonAddress({
            ...this.createAddressForm.value,
            addrZipCode: zipCode?.zipCode,
          });
      api.subscribe((resp: any) => {
        if (resp.responseCode === ResponseCode.Success) {
          this.dialogRef.close(true);
          this.notifierService.showInfoNotification(
            isEdit ? '常用指送地址已修改成功' : '常用指送地址已新增成功'
          );
          return
        }
        this.notifierService.showInfoNotification(
          isEdit ? resp.errorMessage.message : '常用指送地址修改失敗'
        );
        this.error.submitInvalid = true;
        this.error.errorMessage = resp.errorMessage;
        document.querySelector(".dialog-content")?.scrollIntoView();
      });
    }
  }
  ngOnInit(): void {
    const oldData = this.data.oldData as CommonAddress;
    this.createAddressForm = this.fb.group({
      addrName: [
        oldData ? oldData.addrName : '',
        Validators.compose([Validators.required]),
      ],
      addrCity: [
        oldData ? oldData.addrCity : '',
        Validators.compose([Validators.required]),
      ],
      addrCityArea: [
        oldData ? oldData.addrCityArea : '',
        Validators.compose([Validators.required]),
      ],
      addr: [
        oldData ? oldData.addr : '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.regExps['word']),
          createAddressLengthValidator(15)
        ]),
      ],
      receiver: [
        oldData ? oldData.receiver : '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.regExps['word']),
        ]),
      ],
      contactNo: [
        oldData ? oldData.contactNo : '',
        [Validators.required, Validators.pattern(this.regExps['tel'])],
      ],
      phoneNo: [
        oldData ? oldData.phoneNo : '',
        Validators.pattern(this.regExps['mobile']),
      ],
    });

    this.memberService.getCity(true).subscribe((res) => {
      if (res.responseCode === ResponseCode.Success) {
        this.cities = res.result.data
          .map((data) => {
            return { label: data.city, value: data.city };
          })
      }
    });

    oldData?.addrCity &&
    //2799需求 needDelivery=true
      this.memberService.getCityArea(oldData.addrCity, true).subscribe((res) => {
        if (res.responseCode === ResponseCode.Success) {
          this.cityAreas = res.result.data;
          this.areas = this.cityAreas.map((data) => {
            return { label: data.area, value: data.area };
          });
        }
      });

    this.disabledarea = !oldData?.addrCity;

    this.createAddressForm
      .get('addrCity')
      ?.valueChanges.pipe(
        //2799需求 needDelivery=true
        tap(res => {
          if(res != null){
            this.disabledarea = false;
          }else{
            this.disabledarea = true;
          }
        }),
        switchMap((city) => this.memberService.getCityArea(city, true)),
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
  checkAddrLength(event : number){
    if(event > 45){
      this.addrOverLength = true;
    }else{
      this.addrOverLength = false;
    }
  }
  cityChange(){
    this.areas = [];
  }
}
