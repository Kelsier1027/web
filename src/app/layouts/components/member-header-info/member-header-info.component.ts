/** --------------------------------------------------------------------------------
 *-- Description： 會員中心 header
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/core/services/storage.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Title } from '@angular/platform-browser';
import { ORG_ID } from 'src/app/shared/utils/basicInfoUtilities';

@Component({
  selector: 'app-member-header-info',
  templateUrl: './member-header-info.component.html',
  styleUrls: ['./member-header-info.component.scss'],
})
export class MemberHeaderInfoComponent implements OnInit {
  customerName = '';
  companyName = '';
  email = '';
  customerClass = 1;
  usableBonusPoints = '0';
  availableAwards = '0';
  tracingItems = '0';
  cartCount = '0';
  restockNotifyCount = '0';

  isUnitPrice = true;

  constructor(private storageService: StorageService, 
    private router: Router,
    public authService: AuthService,
    private sharedService: SharedService, 
    private title: Title) {
      this.title.setTitle(`會員中心 - ${ORG_ID.getOrgName()}`);
    }

  ngOnInit(): void {
    this.getMemberInfo();
    this.sharedService.isUnitPrice$.subscribe((isUnitPrice) => {
      this.isUnitPrice = isUnitPrice;
    });
  }

  getMemberInfo() {
    this.customerName = localStorage.getItem('customerName')?.toString() || '';
    this.companyName = localStorage.getItem('companyName')?.toString() || '';
    this.email = localStorage.getItem('email')?.toString() || '';
    this.customerClass = +(localStorage.getItem('customerClass') || 1);
    this.usableBonusPoints =
      localStorage.getItem('usableBonusPoints')?.toString() || '';
    this.availableAwards =
      localStorage.getItem('availableAwards')?.toString() || '';
    this.tracingItems = localStorage.getItem('tracingItems')?.toString() || '';
    this.cartCount = localStorage.getItem('cartCount')?.toString() || '';
    this.restockNotifyCount =
      localStorage.getItem('restockNotifyCount')?.toString() || '';
  }

  unitPriceChange(isUnitPrice: boolean) {
    this.isUnitPrice = isUnitPrice;
    this.storageService.set('isunitprice', isUnitPrice);
    this.sharedService.setUnitPrice(isUnitPrice);
  }

  logout() {
    this.authService.logout({}).subscribe();
    this.storageService.clear();
    this.router.navigate(['/Account/Login']);
  }

  displayBonus(): boolean {
    return JSON.parse(localStorage.getItem('displayBonus') ?? 'false');
  }
}
