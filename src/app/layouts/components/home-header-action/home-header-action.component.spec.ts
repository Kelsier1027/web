import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeHeaderActionComponent } from './home-header-action.component';

describe('HomeHeaderActionComponent', () => {
  let component: HomeHeaderActionComponent;
  let fixture: ComponentFixture<HomeHeaderActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeHeaderActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeHeaderActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
