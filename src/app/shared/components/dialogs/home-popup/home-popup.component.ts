import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EnvConfig } from 'src/app/app.module';
import { LayoutService } from 'src/app/shared/services';
import { MemberService } from 'src/app/services';
import { ResponseCode } from 'src/app/enums/response.enum';
import { Router } from '@angular/router';
import { resourceLimits } from 'worker_threads';
import { TRACK_PARAMS } from 'src/app/shared/utils/trackParamUtilities';
@Component({
  selector: 'app-home-popup',
  templateUrl: './home-popup.component.html',
  styleUrls: ['./home-popup.component.scss'],
})
export class HomePopupComponent implements OnInit {
  //src ="https://fakeimg.pl/680x680/";
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<HomePopupComponent>,
    private envConfig: EnvConfig,
    public layoutService: LayoutService,
    public memberService:MemberService,
    private router: Router
  ) {}
  src: string = "";
  url = this.data.url ?? '';

  ngOnInit(): void {
    this.layoutService.layoutChanges$.subscribe((currentScreenSize) => {
      if (currentScreenSize === "small") {
        this.src = this.envConfig.baseApiUrl + this.data.srcForMobile;
        return;
      }
      this.src = this.envConfig.baseApiUrl + this.data.src;
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  adLink(): void{
    if(this.url){
      const param = {
        adId : this.data.adId,
        originalUrl : this.url,
        isExternal : this.data.isExternal
      }
      this.memberService.gethomepagePopupAdLink(param).subscribe((res) =>{
        if (res.responseCode === ResponseCode.Success) {
          if(res.result.needsPost && res.result.formData){
            const form = document.createElement('form');
            const formData = new FormData();
            // 設置表單屬性
            form.method = 'POST';
            form.action = res.result.url;
            form.target = '_blank';

            formData.append('ACTION',res.result.formData.ACTION)
            formData.append('CODE',res.result.formData.CODE)
            formData.append('KEY',res.result.formData.KEY)
            formData.append('MAIL',res.result.formData.MAIL)
            formData.append('MSG',res.result.formData.MSG)
            formData.append('PID',res.result.formData.PID)
            formData.append('STATUS',res.result.formData.STATUS)
            formData.append('TAX_REFERENCE',res.result.formData.TAX_REFERENCE)
            formData.append('URL',res.result.formData.URL)
            formData.append('WEB',res.result.formData.WEB)
            const iterator = formData.entries();

            for (const [key, value] of iterator) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = value.toString();
                form.appendChild(input);
            }
            document.body.appendChild(form);

            form.submit();

            document.body.removeChild(form);
          }else{
            const url = TRACK_PARAMS.combine(
              res.result.url, 
              "home-popup", 
              this.data.adId
            );

            window.open(url, "_blank");
          }
        }
      })
    }

  }
}
