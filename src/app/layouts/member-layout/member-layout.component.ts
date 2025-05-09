/** --------------------------------------------------------------------------------
 *-- Description： 會員中心 layout
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, Input, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/shared/services/layout.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
@Component({
  selector: 'app-member-layout',
  templateUrl: './member-layout.component.html',
  styleUrls: ['./member-layout.component.scss'],
})
export class MemberLayoutComponent implements OnInit {
  currentScreenSize: string = '';
  title: string = '';

  // 這個元件的 title 不知道為什麼沒開外部注入，
  // 因為是開發後期才需要調整，這裡多開一個 boolean 來處理
  @Input() isMember?: boolean = false;
  
  constructor(
    private router: Router,
    public layoutService: LayoutService
  ) {
  }

  ngOnInit() {
    if (this.isMember && !this.title)
      this.title = '會員中心'
  }

  redirect(): void {
    if(this.router.url == "/Member/Member"){
      this.router.navigate(['/']);
    }
    else{
      this.router.navigate(['/Member']);
    }
  }
}
