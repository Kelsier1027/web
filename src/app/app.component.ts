import { Component } from '@angular/core';
import { LOADING_MASK_UTIL } from './shared/utils/loadingMaskUtilities';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = '';

  constructor(
  ) { }
  ngOnInit() {
  }

  isLoading(): boolean {
    return LOADING_MASK_UTIL.isLoading();
  }
}
