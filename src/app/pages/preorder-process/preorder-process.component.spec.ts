import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreorderProcessComponent } from './preorder-process.component';

describe('PreorderProcessComponent', () => {
  let component: PreorderProcessComponent;
  let fixture: ComponentFixture<PreorderProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreorderProcessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreorderProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
