import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfcertificateComponent } from './selfcertificate.component';

describe('SelfcertificateComponent', () => {
  let component: SelfcertificateComponent;
  let fixture: ComponentFixture<SelfcertificateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelfcertificateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfcertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
