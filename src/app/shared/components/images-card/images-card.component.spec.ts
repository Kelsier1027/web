import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesCardComponent } from './images-card.component';

describe('ImagesCardComponent', () => {
  let component: ImagesCardComponent;
  let fixture: ComponentFixture<ImagesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImagesCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImagesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
