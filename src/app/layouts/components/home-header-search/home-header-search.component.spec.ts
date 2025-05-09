import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeHeaderSearchComponent } from './home-header-search.component';

describe('HomeHeaderSearchComponent', () => {
  let component: HomeHeaderSearchComponent;
  let fixture: ComponentFixture<HomeHeaderSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeHeaderSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeHeaderSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
