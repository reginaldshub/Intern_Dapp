import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqdashboardComponent } from './reqdashboard.component';

describe('ReqdashboardComponent', () => {
  let component: ReqdashboardComponent;
  let fixture: ComponentFixture<ReqdashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReqdashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReqdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
