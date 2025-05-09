import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnchorLayoutComponent } from './anchor-layout.component';

describe('AnchorLayoutComponent', () => {
  let component: AnchorLayoutComponent;
  let fixture: ComponentFixture<AnchorLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnchorLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnchorLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
