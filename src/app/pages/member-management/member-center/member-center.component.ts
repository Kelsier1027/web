/** --------------------------------------------------------------------------------
 *-- Description： 會員中心
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, OnInit, inject } from '@angular/core';
import { tap } from 'rxjs';
import { LayoutService } from 'src/app/shared/services';
import { ProductService } from 'src/app/services/product.service';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-member-center',
  templateUrl: './member-center.component.html',
  styleUrls: ['./member-center.component.scss'],
})
export class MemberCenterComponent implements OnInit {
  isMobile: boolean = false;

  guessYouLikes: any[] = [];

  recommended: any[] = [];

  constructor(
    private productService: ProductService,
    private sharedService: SharedService
  ) {}

  private readonly layoutService = inject(LayoutService);

  ngOnInit(): void {
    this.layoutService.layoutChanges$.subscribe(
      (size) => (this.isMobile = size === 'small')
    );
    this.loadGuessYouLikes();
    this.loadRecommended();
  }

  loadGuessYouLikes() {
    this.productService.getGuessYouLikeList({}).subscribe((res) => {
      this.guessYouLikes = res?.result?.guessYouLike ?? [];
    });
  }

  loadRecommended() {
    this.productService.getRecommendedList({}).subscribe((res) => {
      this.recommended = res?.result?.recommended ?? [];
    });
  }
}
