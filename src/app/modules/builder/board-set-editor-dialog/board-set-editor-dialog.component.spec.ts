import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardSetEditorDialogComponent } from './board-set-editor-dialog.component';

describe('BoardsetEditorDialogComponent', () => {
  let component: BoardSetEditorDialogComponent;
  let fixture: ComponentFixture<BoardSetEditorDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardSetEditorDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardSetEditorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
