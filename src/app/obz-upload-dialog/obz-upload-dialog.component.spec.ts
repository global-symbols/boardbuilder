import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ObzUploadDialogComponent } from './obz-upload-dialog.component';

describe('ObzUploadDialogComponent', () => {
  let component: ObzUploadDialogComponent;
  let fixture: ComponentFixture<ObzUploadDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ObzUploadDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObzUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
