import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeHeaderTypeListComponent } from './home-header-type-list.component';

describe('HomeHeaderTypeListComponent', () => {
  let component: HomeHeaderTypeListComponent;
  let fixture: ComponentFixture<HomeHeaderTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeHeaderTypeListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeHeaderTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
