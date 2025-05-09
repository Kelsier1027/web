import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StickyService {
  sticky!: boolean
  constructor() { }

  setItemSticky(nav: HTMLDivElement) {
    window.onscroll = () => {
      const boundingClientRect = nav.getBoundingClientRect()
      if (boundingClientRect.y < 0 && !this.sticky) {
        this.sticky = true
      }

      if (boundingClientRect.y > 0 && this.sticky) {
        this.sticky = false
      }
    }
  }
}
