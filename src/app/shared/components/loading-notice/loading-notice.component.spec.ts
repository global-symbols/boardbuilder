import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingNoticeComponent } from './loading-notice.component';

describe('LoadingNoticeComponent', () => {
  let component: LoadingNoticeComponent;
  let fixture: ComponentFixture<LoadingNoticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingNoticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
