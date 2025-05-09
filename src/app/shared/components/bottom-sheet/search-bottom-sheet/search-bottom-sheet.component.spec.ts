import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBottomSheetComponent } from './search-bottom-sheet.component';

describe('SearchBottomSheetComponent', () => {
  let component: SearchBottomSheetComponent;
  let fixture: ComponentFixture<SearchBottomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchBottomSheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
