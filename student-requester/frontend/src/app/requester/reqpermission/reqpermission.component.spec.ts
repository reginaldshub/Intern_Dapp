import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqpermissionComponent } from './reqpermission.component';

describe('ReqpermissionComponent', () => {
  let component: ReqpermissionComponent;
  let fixture: ComponentFixture<ReqpermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReqpermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReqpermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
