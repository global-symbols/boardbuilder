import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObfUploadDialogComponent } from './obf-upload-dialog.component';

describe('ObfUploadDialogComponent', () => {
  let component: ObfUploadDialogComponent;
  let fixture: ComponentFixture<ObfUploadDialogComponent>;

  beforeEach(async(() => {
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
