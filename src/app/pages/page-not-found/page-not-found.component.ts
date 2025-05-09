/** --------------------------------------------------------------------------------
 *-- Description： page not found
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { isPlatformServer } from '@angular/common';
import {
  Component,
  Inject,
  InjectionToken,
  OnInit,
  Optional,
  PLATFORM_ID,
} from '@angular/core';
import { Router } from '@angular/router';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
import { Request, Response } from 'express';
import { DialogService } from 'src/app/shared/services';
import { POP_UP } from 'src/app/shared/utils/popUpUtilities';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
})
export class PageNotFoundComponent implements OnInit {
  constructor(
    @Optional() @Inject(REQUEST) private request: Request,
    @Optional() @Inject(RESPONSE) private response: Response,
    @Inject(PLATFORM_ID) private platformId: InjectionToken<Object>,
    private dialogService: DialogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      this.response.status(404);
    }

    const hint = [
      '很抱歉，您要瀏覽的頁面可能已不存在。',
      '已為您跳轉回首頁，歡迎繼續選購，或聯絡線上客服。'
    ];

    this.router.navigateByUrl('/');
    POP_UP.showMessage(this.dialogService, '糟了！查無頁面', hint);
  }
}
