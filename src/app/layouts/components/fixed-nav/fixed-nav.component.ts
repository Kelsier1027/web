/** --------------------------------------------------------------------------------
 *-- Description： Navigator
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
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import {
  Subscription,
  Timestamp,
  catchError,
  interval,
  map,
  of,
  switchMap,
  take,
  tap,
  timestamp,
} from 'rxjs';
import { GlobalStateService } from 'src/app/core/services/global-state.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { ResponseCode } from 'src/app/enums';
import { LayoutEnum } from 'src/app/enums/layout.enum';
import { StorageEnum } from 'src/app/enums/storage.enum';
import { CompareProduct2, Product2, ResultRes } from 'src/app/models';
import { RecentProduct, ReviewedList } from 'src/app/models/fixed-nav.model';
import { MemberService, ProductService } from 'src/app/services';
import { DialogService, NotifierService } from 'src/app/shared/services';
import { LayoutService } from 'src/app/shared/services/layout.service';
import { Chat, ChatMessage } from 'src/app/models/member.model';
import { FixNavBarService } from 'src/app/services/fix-navbar.service';
import { update, values } from 'ramda';
import { Binary } from '@angular/compiler';
import { POP_UP } from 'src/app/shared/utils/popUpUtilities';
@Component({
  selector: 'app-fixed-nav',
  templateUrl: './fixed-nav.component.html',
  styleUrls: ['./fixed-nav.component.scss'],
})
export class FixedNavComponent implements OnInit {
  readonly LayoutEnum = LayoutEnum;
  @Input() compareItems: CompareProduct2[] = [];

  imageUrl = '../../../../assets/icons/member_cs.png';
  isCustomerPopupVisible = false;
  isOpenFixedNav$ = this.globalStateService.isOpenFixedNav$;
  isComparison = false;
  isQueryingRecentlyViewed = false;

  showButton: boolean = false;
  countButton: boolean = false;
  goToTopShow: boolean = true;
  isHideNavbar: boolean = true;
  sendMessagecontent: string = '';
  // message = [
  //   {
  //     imgUrl: '../../../../assets/images/CS_Card_FAQ.png',
  //     title: '常見問題',
  //     text: '提供大家最常問的服務項目，若還有其他問題，歡迎與我們聯繫。',
  //     link: ['查看帳戶問題', '查看付款問題', '查看訂單問題'],
  //     time: '16:23',
  //   },
  //   {
  //     imgUrl: '../../../../assets/images/CS_Card_Transfer.png',
  //     title: '帳單繳款通知',
  //     text: '您好！您這期帳單即將到期，請於10/30前進行匯款，以免影響到您的信用額度，若已匯款可忽略此訊息。',
  //     link: ['查看本期金額', '查看匯款資訊'],
  //     time: '16:23',
  //   },
  //   {
  //     imgUrl: '../../../../assets/images/CS_Card_Over.png',
  //     title: '帳單逾期通知',
  //     text: '您好！您這期帳單已逾期，請立即匯款或聯絡我的業務，若已匯款可忽略此訊息。',
  //     link: ['聯絡我的業務', '查看匯款資訊'],
  //     time: '16:23',
  //   },
  //   {
  //     imgUrl: '../../../../assets/images/CS_Card_Point.png',
  //     title: '紅利即將到期通知',
  //     text: '您好！您有245點紅利點數將於2022/11/25到期，立即前往使用吧。',
  //     link: ['查看紅利點數', '前往購物'],
  //     time: '16:23',
  //   },
  // ];
  message: ChatMessage[] = [];
  recentProducts: RecentProduct[] = [{ time: '', list: [] }];
  isnewMessage: boolean = false;
  isSendingMessage: boolean = false;

  count = 0;
  tempTime: Date | null = null;
  @Output() layoutZIndexChange = new EventEmitter();

  @ViewChild('textElement') textElement: ElementRef | undefined;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  readonly chatPollingInterval = 10000;

  constructor(
    public dialogService: DialogService,
    public layoutService: LayoutService,
    private router: Router,
    private storageService: StorageService,
    private productService: ProductService,
    private memberService: MemberService,
    private notifierService: NotifierService,
    private globalStateService: GlobalStateService,
    private renderer: Renderer2,
    private fixNavBarService: FixNavBarService,
  ) {
    this.getMessages();
    setInterval(() => this.getMessages(), this.chatPollingInterval);
  }

  ignoreTimezoneInDate(date: Date): Date {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  }

  getMessages(): void {
    this.queryMessages().subscribe((res: ResultRes<Chat>) => {
      this.populateMessages(res);
    });
  }

  queryMessages() {
    let param: any = {};
    param.since = this.getSinceForChatQuery().toISOString();

    this.count++;
    return this.memberService.getChat(param);
  }

  populateMessages(res: ResultRes<Chat>) {
    // 有打開聊天視窗時，順便更新已讀時間
    if (this.isCustomerPopupVisible) {
      // 更新最後已讀時間，因為是否成功更新並不太重要，所以不針對結果做任何處理
      this.memberService.updateChatReadTime()
      .pipe(take(1))
      .subscribe();
    }

    if (res.responseCode === ResponseCode.Success) {
      if (res.result.messages?.length) {
        // 檢查前 10 則訊息，如果有重複的資料，就不 populate，避免因傳送文字和背景循環異步競合而重複顯示訊息
        const recents = this.message.slice(-10) ?? [];
        const lastMessage = res.result.messages.slice(-1)?.pop();

        res.result.messages
          .filter((msg) => recents.every((r) => r.id != msg.id))
          .forEach((message) => {
            this.message.push(message);
          });

        const recordMessageId = this.storageService.get("lastMessageId", "localStorage") as any

        if (this.isCustomerPopupVisible) {
          this.storageService.set("lastMessageId", lastMessage?.id ?? "", "localStorage")
        }

        // 未讀紅點
        this.isnewMessage = !this.isCustomerPopupVisible
                            && !!lastMessage
                            && !lastMessage.isRead
                            && recordMessageId != lastMessage.id;
      }
    }
  }

  //確認是否要顯示訊息上方的日期
  chkDate(date: Date) {
    if (this.tempTime == null) {
      this.tempTime = date;
      return date;
    }
    const yearByDate = new Date(date).getFullYear();
    const monthByDate = new Date(date).getMonth() + 1;
    const dayByDate = new Date(date).getDate();

    const yearBytempTime = new Date(this.tempTime).getFullYear();
    const monthBytempTime = new Date(this.tempTime).getMonth() + 1;
    const dayBytempTime = new Date(this.tempTime).getDate();
    if (
      yearByDate !== yearBytempTime ||
      monthByDate !== monthBytempTime ||
      dayByDate !== dayBytempTime
    ) {
      this.tempTime = date;
      return date;
    }
    return null;
  }
  scrollToBottom() {
    try {
      // Using nativeElement to access DOM properties
      const container = this.scrollContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    } catch (err) {}
  }
  //轉換時間
  convertTime(time: Date | null, state?: string) {
    if (time == null) {
      return '';
    } else if (state == 'message') {
      return moment(time).format('YYYY/MM/DD HH:mm');
    } else {
      return moment(time).format('YYYY/MM/DD');
    }
  }
  ngOnInit(): void {
    this.checkRoute();
    this.onGetProducts();
    // this.getMessage();
    this.isOpenFixedNav$.subscribe((openFixedNav) => {
      if (openFixedNav === LayoutEnum.RecentlyViewed) {
        window.scrollTo(0, 0);
        this.layoutZIndexChange.emit(2);
      } else {
        this.layoutZIndexChange.emit(4);
      }
      this.fixNavBarService.ishideNavbar$.subscribe((value) => {
        if (value != null) this.isHideNavbar = value; // 更新狀態
      });
    });

    // this.storageService.set(
    //   StorageEnum.ComparingItems,
    //   this.compareItems
    // );
  }

  closeChat() {
    if (this.imageUrl == '../../../../assets/icons/close.png')
      this.toggleCustomer();
  }

  toggleCustomer() {
    const lastMessage = this.message.slice(-1)?.pop();
    if (lastMessage) {
      this.storageService.set("lastMessageId", lastMessage.id, "localStorage")
    }

    if (this.imageUrl === '../../../../assets/icons/member_cs.png') {
      this.imageUrl = '../../../../assets/icons/close.png';
      this.isCustomerPopupVisible = true;
      this.isnewMessage = false;
      this.getMessages();
      this.layoutZIndexChange.emit(2);
    } else {
      this.imageUrl = '../../../../assets/icons/member_cs.png';
      this.isCustomerPopupVisible = false;
      this.layoutZIndexChange.emit(4);
    }
  }

  closePopup() {
    this.isCustomerPopupVisible = false;
  }

  toggleDialog(
    openFixedNav: LayoutEnum.RecentlyViewed | LayoutEnum.Category | null
  ) {
    this.onGetProducts();
    this.globalStateService.isOpenFixedNav$.next(openFixedNav);
  }

  private onGetProducts() {
    this.recentProducts = [{ time: '', list: [] }];
    const reviewedList: ReviewedList[] = (this.storageService.get(
      StorageEnum.RecentlyViewed
    ) || []) as any;

    const itemIds = reviewedList.map((item) => Number(item.itemId));

    if (itemIds.length) {
      this.isQueryingRecentlyViewed = true;
      this.productService
        .getProductList({ itemIds }, true)
        .pipe(catchError(_ => {
          this.isQueryingRecentlyViewed = false;
          return of();
        }))
        .subscribe((response: ResultRes<any> | []) => {
          this.isQueryingRecentlyViewed = false;
          if ('result' in response) {
            // Assuming response has a 'result' property
            const data: Product2[] = response['result']['data'];
            const dataMap: { [key: string]: Product2 } = {};
            if (Array.isArray(data)) {
              data.forEach((item) => {
                dataMap[item.itemId] = item;
              });

              const parsedReviewedMap: { [key: string]: Product2[] } = {};
              reviewedList.forEach((item: ReviewedList) => {
                const lastViewedTime = moment(item.lastViewedTime).format(
                  'YYYY/MM/DD'
                );
                if (parsedReviewedMap[lastViewedTime]) {
                  parsedReviewedMap[lastViewedTime].push(dataMap[item.itemId]);
                } else {
                  parsedReviewedMap[lastViewedTime] = [dataMap[item.itemId]];
                }
              });

              const newRecentProducts: RecentProduct[] = [];
              Object.keys(parsedReviewedMap).forEach((time) => {
                newRecentProducts.push({
                  time: time,
                  list: parsedReviewedMap[time]
                    .filter((item) => item)
                    .map((item) => ({
                      itemId: item.itemId.toString(),
                      itemNumber: item.itemNumber.toString(),
                      productName: item.itemName,
                      productPrice: item.unitPrice.toString(),
                      imgUrl: item.prodImg,
                      status: 'cart',
                      favorite: item.favorite,
                      productDisplayStatus: item.productDisplayStatus,
                      description: item.description
                    })),
                });
              });

              this.recentProducts = newRecentProducts;
            }
          }
        });
    }
  }

  toggleComparisonDialog() {
    this.isComparison = !this.isComparison;
  }

  areaHeight(textarea: HTMLElement, scrollContainer: HTMLElement): void {
    const maxRows = 3;
    const lineHeight = 25;
    textarea.style.height = 'auto';
    const scrollHeight = textarea.scrollHeight;

    if (scrollHeight > textarea.clientHeight) {
      textarea.style.height = `${Math.min(
        scrollHeight,
        maxRows * lineHeight
      )}px`;
    }
  }

  addToCart(product: any) {
    const url = `/Product?itemId=${product.itemId}`;
    window.location.href = url;
  }

  followDialog(product: any, action: any) {
    if (product != null) {
      for (let i = 0; i < this.recentProducts.length; i++) {
        for (let j = 0; j < this.recentProducts[i].list.length; j++) {
          let getProduct = this.recentProducts[i].list[j];
          if (getProduct.itemId === product.itemId) {
            getProduct.favorite = !getProduct.favorite;
            product.favorite = !getProduct.favorite;
          }
        }
      }
      this.dialogService.closeAll();
    }

    let modelOption = { modelName: '', config: {} };
    if (action == 'heart') {
      modelOption.modelName = 'simple-dialog';
      modelOption.config = {
        data: {
          StyleMargin: '0px',
          text: product.favorite ? '商品已加入追蹤' : '商品已移除追蹤',
          textAlign: 'center',
        },
        width: '368px',
        height: '119px',
        hasBackdrop: false,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: 'dark',
      };
    } else if (action == 'clearAll') {
      modelOption.modelName = 'simple-dialog';
      modelOption.config = {
        data: {
          title: '清除最近瀏覽',
          StyleMargin: '0px',
          text: '請確認是否要清除最近瀏覽，清除後紀錄將不會留存。',
          displayFooter: true,
          confirmButton: '清除',
          cancelButton: '取消',
          cancel: () => {
            this.dialogService.closeAll();
          },
          confirm: () => {
            this.storageService.removeItem(StorageEnum.RecentlyViewed);
            this.recentProducts = [{ time: '', list: [] }];
          },
        },
        width: '500px',
        height: 'auto',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: 'clear-all',
      };
    } else if (action == 'add-to-cart') {
      modelOption.modelName = 'select-product';
      modelOption.config = {
        data: {
          title: '請選擇商品內容',
          itemId: product.itemId,
        },
        width: '784px',
        height: '500px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: 'select-product-panel',
      };
    }

    this.dialogService.openLazyDialog(
      modelOption.modelName,
      modelOption.config
    );
  }

  clearDialog() {
    this.toggleComparisonDialog();
    this.dialogService.closeAll();
    const modelOption = {
      modelName: 'simple-dialog',
      config: {
        data: {
          title: '刪除商品',
          StyleMargin: '0px',
          text: '請確認是否要刪除此商品，刪除後商品將不會留存。',
          displayFooter: true,
          confirmButton: '刪除',
          cancelButton: '取消',
          color: 'warn',
          confirm: () => {
            this.compareItems.splice(0, this.compareItems.length);
            this.storageService.set(
              StorageEnum.ComparingItems,
              this.compareItems
            );
            this.isComparison = false;
          },
        },
        width: '500px',
        height: 'auto',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: '',
      },
    };

    this.dialogService.openLazyDialog(
      modelOption.modelName,
      modelOption.config
    );
  }

  goToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  checkRoute() {
    if (
      this.router.url.startsWith('/ProductList') ||
      this.router.url.startsWith('/Product') ||
      this.router.url === '/'
    ) {
      this.showButton = true;
    } else {
      this.showButton = false;
    }
  }

  addToWishList(detailId: string): void {
    const isSales = JSON.parse(localStorage.getItem('isSales') ?? 'true');

    if (isSales)
    {
      const hint = ['很抱歉，您的身分組（查價員）無法使用此功能。', '如有疑問，請聯絡您的帳戶管理員，或聯絡線上客服。'];
      POP_UP.showMessage(this.dialogService, '您的身分組不支援此功能', hint);
      return;
    }

    if (detailId)
      this.memberService
        .addWishList(Number(detailId))
        .subscribe((resp: any) => {
          if (resp.responseCode === ResponseCode.Success) {
            this.notifierService.showInfoNotification('已加入追蹤清單');
            this.onGetProducts();
          } else {
            this.notifierService.showInfoNotification(resp.responseMessage);
          }
        });
  }

  onComparison() {
    if (this.compareItems.length < 2) {
      this.openWarningDialog();
    } else {
      this.router.navigate(['ProductComparison'], {
        queryParams: {
          compareItems: this.compareItems
            .map((item: { itemId: any }) => item.itemId)
            .filter((item: any) => item)
            .join('+'),
        },
      });
    }
  }

  removeAt(index: number) {
    this.compareItems.splice(index, 1);
    this.storageService.set(StorageEnum.ComparingItems, this.compareItems);
  }

  contactBusinessDialog(itemNumber: string, itemName: string) {
    const modelOption = {
      modelName: 'contact-business',
      config: {
        data: {
          title: '請洽業務',
          StyleMargin: '0px',
          text: '',
          isIcon: false,
          itemNumber: itemNumber,
          itemName: itemName,
        },
        width: '500px',
        height: '356px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: '',
      },
    };

    this.dialogService.openLazyDialog(
      modelOption.modelName,
      modelOption.config
    );
  }

  arrivalNoticeDialog(itemId: string, itemName: string, itemNumber: string) {
    const modelOption = {
      modelName: 'arrival-notice',
      config: {
        data: {
          title: '貨到通知',
          StyleMargin: '0px',
          text: '目前庫存已完售（暫無確切交期），若有需求請洽業務掛單，待貨到後再行通知。謝謝！',
          isIcon: false,
          itemId: itemId,
          itemName: itemName,
          itemNumber: itemNumber,
        },
        width: '500px',
        height: '654px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: '',
      },
    };

    this.dialogService.openLazyDialog(
      modelOption.modelName,
      modelOption.config
    );
  }

  private openWarningDialog(type?: string) {
    const data = {
      title: '無法進行比較',
      text: `只選擇 ${this.compareItems.length} 項商品時無法進行比較，請選擇 2 項以上商品。`,
    };
    if (type === 'over') {
      data.title = '無法加入比較';
      data.text = `已達比較商品上限，請先移除其中一個比較商品再加入新商品。`;
    }
    const config = {
      data: {
        StyleMargin: '0px',
        displayFooter: true,
        confirmButton: '確認',
        isIcon: false,
        ...data,
      },
      width: '500px',
      height: '204px',
      hasBackdrop: true,
      autoFocus: false,
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '300ms',
      panelClass: 'directionsDialog',
    };
    this.dialogService.openLazyDialog('simple-dialog', config);
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.goToTopShow = window.scrollY > 0;
  }

  adLink(url: string | null, adId: number, isExternal: boolean): void {
    if (url != null) {
      const param = {
        adId: adId,
        originalUrl: url,
        isExternal: isExternal,
      };
      this.memberService.gethomepagePopupAdLink(param).subscribe((res) => {
        if (res.responseCode === ResponseCode.Success) {
          if (res.result.needsPost && res.result.formData) {
            const form = document.createElement('form');
            // 設置表單屬性
            form.method = 'POST';
            form.action = res.result.url;
            form.target = '_blank';

            const iterator = Object.entries(res.result.formData);

            for (const [key, value] of iterator) {
              const input = document.createElement('input');
              input.type = 'hidden';
              input.name = key;
              input.value = String(value);
              form.appendChild(input);
            }
            document.body.appendChild(form);

            form.submit();

            document.body.removeChild(form);
          } else {
            window.open(res.result.url, '_blank');
          }
        }
      });
    }
  }

  getSinceForChatQuery(): Date {
    const lastCreationTime = this.message.slice(-1)?.pop()?.creationTime;

    if (lastCreationTime)
      return this.ignoreTimezoneInDate(new Date(lastCreationTime));

    return new Date('2000-01-01');
  }

  sendMessag(textarea: HTMLElement) {
    if (this.isSendingMessage) return;

    if (!this.sendMessagecontent?.trim()) return;

    this.isSendingMessage = true;

    const param: any = {
      content: this.sendMessagecontent,
      since: '',
    };

    // 這裡在送出訊息，所以把文字框清空
    this.sendMessagecontent = '';
    textarea.style.height = 'auto';

    param.since = this.getSinceForChatQuery().toISOString();

    this.memberService.sendMessage(param).subscribe((res) => {
      if (res.responseCode === ResponseCode.Success) {
        this.populateMessages(res);
      }
      this.isSendingMessage = false;
    });
  }
  onFileSelected(e: any) {
    const input = e.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('imageFile', file);
      if (formData.get('imageFile')) {
        this.isSendingMessage = true;
        formData.append('since', this.getSinceForChatQuery().toISOString());
        this.memberService.sendImage(formData).subscribe((res) => {
          if (res.responseCode === ResponseCode.Success) {
            this.populateMessages(res);
          }
          this.isSendingMessage = false;
        });
      }
    }
  }
}
