import { ViewportScroller } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { StickyService } from 'src/app/shared/services/sticky.service';

@Component({
  selector: 'app-anchor-layout',
  templateUrl: './anchor-layout.component.html',
  styleUrls: ['./anchor-layout.component.scss'],
})
export class AnchorLayoutComponent implements AfterViewInit{
  activeIndex = 0
  @ViewChild('nav') nav!: ElementRef

  constructor(public stickyService: StickyService,
    private viewportScroller: ViewportScroller
  ) {
  }


  ngAfterViewInit(): void {
    this.stickyService.setItemSticky(this.nav.nativeElement)
  }

  active($event: any) {
    this.activeIndex = Number($event) - 1;
  }

  onClick(elementName: string) {
    this.viewportScroller.scrollToAnchor(elementName);
  }
}
