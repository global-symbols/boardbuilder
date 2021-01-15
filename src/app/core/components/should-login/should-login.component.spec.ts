import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShouldLoginComponent } from './should-login.component';

describe('ShouldLoginComponent', () => {
  let component: ShouldLoginComponent;
  let fixture: ComponentFixture<ShouldLoginComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShouldLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShouldLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
