import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchRadiusInputComponent } from './search-radius-input.component';

describe('SearchRadiusInputComponent', () => {
  let component: SearchRadiusInputComponent;
  let fixture: ComponentFixture<SearchRadiusInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchRadiusInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchRadiusInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
