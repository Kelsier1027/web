/** --------------------------------------------------------------------------------
 *-- Description： 會員中心 menu
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { URL_UTIL } from 'src/app/shared/utils/urlUtilities';

@Component({
  selector: 'app-member-menu',
  templateUrl: './member-menu.component.html',
  styleUrls: ['./member-menu.component.scss'],
})
export class MemberMenuComponent implements OnInit {
  displayBonus = false;
  
  constructor(public authService: AuthService,
    private route: ActivatedRoute
  ) {}

  @Input() active: string = '';

  ngOnInit(): void {
    this.displayBonus = JSON.parse(localStorage.getItem('displayBonus') || "false");
  }

  getDealerView(): string | null {
    return URL_UTIL.getDealerView(this.route.snapshot);
  }

  isSales(): boolean {
    return JSON.parse(localStorage.getItem('isSales') ?? 'true');
  }
}
