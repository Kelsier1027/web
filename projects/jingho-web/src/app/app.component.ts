import { Component } from '@angular/core';
import { LOADING_MASK_UTIL } from '../../../../src/app/shared/utils/loadingMaskUtilities';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'jingho-web';
  isLoading(): boolean {
    return LOADING_MASK_UTIL.isLoading();
  }
}