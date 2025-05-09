import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelCheckboxComponent } from './model-checkbox.component';

describe('ModelCheckboxComponent', () => {
  let component: ModelCheckboxComponent;
  let fixture: ComponentFixture<ModelCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelCheckboxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
