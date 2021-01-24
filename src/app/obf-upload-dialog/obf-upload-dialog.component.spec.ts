import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {ObfUploadDialogComponent} from './obf-upload-dialog.component';

describe('ObfUploadDialogComponent', () => {
  let component: ObfUploadDialogComponent;
  let fixture: ComponentFixture<ObfUploadDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ObfUploadDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObfUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
