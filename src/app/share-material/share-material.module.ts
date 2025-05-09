import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatMomentDatetimeModule } from '@mat-datetimepicker/moment';
import { MatDatetimepickerModule } from '@mat-datetimepicker/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';

const MatModules = [
  MatTableModule,
  MatPaginatorModule,
  MatMenuModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCheckboxModule,
  MatInputModule,
  MatFormFieldModule,
  MatCardModule,
  MatIconModule,
  MatListModule,
  MatExpansionModule,
  MatBadgeModule,
  CdkTreeModule,
  MatSnackBarModule,
  MatDialogModule,
  MatTooltipModule,
  MatSelectModule,
  MatRadioModule,
  MatMomentDatetimeModule,
  MatDatetimepickerModule,
  MatDatepickerModule,
  MatMomentDateModule,
  MatAutocompleteModule,
  ClipboardModule,
  MatBottomSheetModule
];

@NgModule({
  declarations: [],
  imports: [...MatModules],
  exports: [...MatModules],
})
export class ShareMaterialModule {
  static forRoot(providers = []) {
    return {
      ngModule: ShareMaterialModule,
      providers: [...providers],
    };
  }
}
