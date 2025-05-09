import {
  animate,
  group,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/core/services/storage.service';
import { StorageEnum } from 'src/app/enums/storage.enum';
import { CompareProduct2 } from 'src/app/models';
import { DialogService } from '../../services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-comparison',
  templateUrl: './product-comparison.component.html',
  styleUrls: ['./product-comparison.component.scss'],
  animations: [
    trigger('slideInOut', [
      state(
        'in',
        style({
          'max-height': '136px',
          opacity: '1',
          visibility: 'visible',
        })
      ),
      state(
        'out',
        style({
          'max-height': '0px',
          opacity: '0',
          visibility: 'hidden',
        })
      ),
      transition('in => out', [
        group([
          animate(
            '700ms ease-in-out',
            style({
              visibility: 'hidden',
            })
          ),

          animate(
            '600ms ease-in-out',
            style({
              'max-height': '0px',
            })
          ),
          animate(
            '400ms ease-in-out',
            style({
              opacity: '0',
            })
          ),
        ]),
      ]),
      transition('out => in', [
        group([
          animate(
            '1ms ease-in-out',
            style({
              visibility: 'visible',
            })
          ),
          animate(
            '600ms ease-in-out',
            style({
              'max-height': '500px',
            })
          ),
          animate(
            '500ms ease-in-out',
            style({
              opacity: '1',
            })
          ),
        ]),
      ]),
    ]),
  ],
})
export class ProductComparisonComponent implements OnInit {
  @Input()
  currentScreenSize!: string;

  items: any = [];

  emptyItems = ['', '', '', ''];

  animationState = 'out';

  showBottomButton = false;

  maxCompareCount = 4;

  private isComparesInSubscription: Subscription | undefined;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.onSetMaxCount();
  }

  constructor(
    private router: Router,
    private dialogService: DialogService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.onSetMaxCount();
    this.isComparesInSubscription = this.storageService.valueChanged().subscribe((res) => {
      this.items = this.storageService.get(StorageEnum.ComparingItems) || [];
    });
    // const items: CompareProduct2[] = (this.storageService.get(
    //   StorageEnum.ComparingItems
    // ) || []) as any;
    // this.items = items;
    this.emptyItems.splice(0, this.items.length);
    if (this.items.length) {
      this.animationState = 'in';
    }
  }

  add(name: string, price: number, imgUrl: string | string[], itemId?: number) {
    if (this.items.length >= this.maxCompareCount) {
      this.openWarningDialog('over');
      return;
    }
    this.animationState = 'in';
    this.items.push({ name, price, imgUrl, itemId: itemId || 0 });
    this.emptyItems.pop();

    this.storageService.set(StorageEnum.ComparingItems, this.items);
  }

  remove(element: any, toCheck?: boolean) {
    const index = this.items.findIndex(
      (item: { itemId: any; }) => item.itemId === element.itemId
    );
    if (!toCheck) {
      this.items.splice(index, 1);
      this.storageService.set(StorageEnum.ComparingItems, this.items);
    } else {
      this.removeAt(index);
    }
  }

  protected toggleAnimation() {
    if (this.showBottomButton) {
      this.animationState = 'in';
      this.showBottomButton = false;
    } else {
      this.animationState = this.animationState === 'in' ? 'out' : 'in';
      this.showBottomButton = this.animationState === 'out';
    }
  }

  protected removeAt(index: number) {
    this.items.splice(index, 1);
    this.emptyItems.push('');
    if (this.items.length === 0) {
      this.animationState = 'out';
    }
    this.storageService.set(StorageEnum.ComparingItems, this.items);
  }

  protected clearAll() {
    this.items = [];
    this.emptyItems = ['', '', '', ''];
    this.animationState = 'in';
    this.storageService.set(StorageEnum.ComparingItems, this.items);
  }

  protected onComparison() {
    if (this.items.length < 2) {
      this.openWarningDialog();
    } else {
      this.router.navigate(['ProductComparison'], {
        queryParams: {
          compareItems: this.items
            .map((item: { itemId: any; }) => item.itemId)
            .filter((item: any) => item)
            .join('+'),
        },
      });
    }
  }

  private openWarningDialog(type?: string) {
    const data = {
      title: '無法進行比較',
      text: `只選擇 ${this.items.length} 項商品時無法進行比較，請選擇 2 項以上商品。`,
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

  routeToProduct(itemId: number) {
    this.router.navigate(['Product'], { queryParams: { itemId } });
  }

  private onSetMaxCount() {
    this.maxCompareCount = window.innerWidth >= 1024 ? 4 : 2;
  }
}
