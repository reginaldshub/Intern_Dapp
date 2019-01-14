import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Add10thComponent } from './add10th.component';

describe('Add10thComponent', () => {
  let component: Add10thComponent;
  let fixture: ComponentFixture<Add10thComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Add10thComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Add10thComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
