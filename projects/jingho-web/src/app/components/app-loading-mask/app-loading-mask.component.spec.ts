import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppLoadingMaskComponent } from './app-loading-mask.component';

describe('AppLoadingMaskComponent', () => {
  let component: AppLoadingMaskComponent;
  let fixture: ComponentFixture<AppLoadingMaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppLoadingMaskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppLoadingMaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
