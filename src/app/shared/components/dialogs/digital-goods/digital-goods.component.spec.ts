import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalGoodsComponent } from './digital-goods.component';

describe('DigitalGoodsComponent', () => {
  let component: DigitalGoodsComponent;
  let fixture: ComponentFixture<DigitalGoodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DigitalGoodsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DigitalGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
