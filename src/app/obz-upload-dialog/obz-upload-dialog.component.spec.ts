import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObzUploadDialogComponent } from './obz-upload-dialog.component';

describe('ObzUploadDialogComponent', () => {
  let component: ObzUploadDialogComponent;
  let fixture: ComponentFixture<ObzUploadDialogComponent>;

  beforeEach(async(() => {
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
