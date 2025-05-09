import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupByProcessComponent } from './group-by-process.component';

describe('GroupByProcessComponent', () => {
  let component: GroupByProcessComponent;
  let fixture: ComponentFixture<GroupByProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupByProcessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupByProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
