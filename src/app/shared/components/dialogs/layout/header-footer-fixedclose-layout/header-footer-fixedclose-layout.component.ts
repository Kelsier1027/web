/** --------------------------------------------------------------------------------
 *-- Description：layout
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'app-header-footer-fixedclose-layout',
  templateUrl: './header-footer-fixedclose-layout.component.html',
  styleUrls: ['./header-footer-fixedclose-layout.component.scss'],
})
export class HeaderFooterFixedcloseLayoutComponent implements OnInit {
  @Input() data: any;
  @Input() confirmDisabled!: boolean;

  @HostListener('scroll', ['$event']) onElementScroll($event: any) {
    
    // 在現在的結構下, 這個算法沒辦法處理內容太短導致一開始就沒有滾動軸的情境
    // 一般來說會禁用按鈕都是內容很長, 但還是有可能會有這種 edge case
    //
    // 無法解決 edge case 的難點:
    // 起初以為是內容文字可以動態變動導致最初的一瞬間總高度不正確 (refer: memberRight in TermsOfServiceComponent)
    // 但經過修改即使確保這個 component 在內容文字已經讀取完才建立, 或是用除了 ngOnInit 以外其他的 hooks
    // scrollHeight 仍然會在一開始等於可見大小, 直到第一次滾動才會變真正的完整高度
    // 所以如果在讀取完之後就先檢查一次, 一定會解鎖
    //
    // 這個奇怪現象有可能是因為這個 component 用 <ng-content> 來讓外層注入內容
    // 但目前還沒有時間排查，如果未來要針對這個 case 做處理，建議先朝改掉 <ng-content> 方式的方向著手

    // scrollTop 是浮點數
    // clientHeight / scrollHeight 是整數
    // 在不同的縮放比率之下，即使滑到底，座標也可能會有誤差，導致沒辦法正常比較
    // 所以這裡用比較特別的算法，並且允許 1 以內的誤差
    // ref: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#determine_if_an_element_has_been_totally_scrolled
    const dialog = document.querySelector('.dialog-content')!;
    if (Math.abs(dialog.scrollHeight - dialog.clientHeight - dialog.scrollTop) <= 1) {
      this.confirmDisabled = false;
    }
  }
  constructor() {}

  ngOnInit(): void {}
}
