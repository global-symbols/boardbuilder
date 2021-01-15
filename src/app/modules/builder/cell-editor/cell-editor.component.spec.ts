import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CellEditorComponent } from './cell-editor.component';

describe('CellEditorComponent', () => {
  let component: CellEditorComponent;
  let fixture: ComponentFixture<CellEditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CellEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
