import {
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subject, map } from 'rxjs';
import { FilterForm } from 'src/app/models';
import { DialogService, LayoutService } from 'src/app/shared/services';
import { map as Rmap, __, mergeLeft } from 'ramda';

@Component({
  selector: 'app-product-edit-filter',
  templateUrl: './product-edit-filter.component.html',
  styleUrls: ['./product-edit-filter.component.scss'],
})
export class ProductEditFilterComponent implements OnInit, OnDestroy {
  dataSource = [
    {
      name: 'test',
      cond: 'test',
      action: '',
    },
    {
      name: 'test',
      cond: 'test',
      action: '',
    },
    {
      name: 'test',
      cond: 'test',
      action: '',
    },
    {
      name: 'test',
      cond: 'test',
      action: '',
    },
    {
      name: 'test',
      cond: 'test',
      action: '',
    },
  ];
  constructor(
    private dialogservice: DialogService,
    public layoutService: LayoutService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      savedFilter: Subject<any>;
      savedFilter$: Observable<any>;
      savedFilterCount: Subject<any>;
    }
  ) {}

  filterList = this.data.savedFilter$.pipe(
    map(Rmap(mergeLeft({ action: null })))
  );

  modifyFilter(filterData: Partial<FilterForm>) {
    const modelOption = {
      modelName: 'product-modify-filter',
      config: {
        data: {
          title: '修改常用篩選',
          displayFooter: true,
          cancelButton: '取消',
          confirmButton: '確認',
          filterData,
          description: filterData.filterDescription,
          async: true,
        },
        width: '500px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: 'product-edit-filter',
      },
    };
    this.dialogservice
      .openLazyDialog(modelOption.modelName, modelOption.config)
      .then((ref) => {
        ref.afterClosed().subscribe(() => {
          this.data.savedFilter.next(true);
          this.data.savedFilterCount.next(true);
        });
      });
  }

  deleteFilter(filterData: Partial<FilterForm>) {
    const modelOption = {
      modelName: 'product-delete-filter',
      config: {
        data: {
          color: 'warn',
          title: '刪除篩選',
          displayFooter: true,
          cancelButton: '取消',
          confirmButton: '刪除',
          async: true,
          filterId: filterData.filterId,
          filterName: filterData.filterName
        },
        width: '500px',
        height: '204px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: 'product-edit-filter',
      },
    };
    this.dialogservice
      .openLazyDialog(modelOption.modelName, modelOption.config)
      .then((ref) => {
        ref.afterClosed().subscribe(() => {
          this.data.savedFilter.next(true);
          this.data.savedFilterCount.next(true);
        });
      });
  }

  ngOnInit(): void {
    document.body.classList.add('product-edit');
  }

  ngOnDestroy(): void {
    document.body.classList.remove('product-edit');
  }
}
