import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardsetEditorDialogComponent } from './boardset-editor-dialog.component';

describe('BoardsetEditorDialogComponent', () => {
  let component: BoardsetEditorDialogComponent;
  let fixture: ComponentFixture<BoardsetEditorDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardsetEditorDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardsetEditorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
