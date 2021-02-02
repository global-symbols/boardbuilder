import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {BoardSetEditorDialogComponent} from './board-set-editor-dialog.component';

describe('BoardsetEditorDialogComponent', () => {
  let component: BoardSetEditorDialogComponent;
  let fixture: ComponentFixture<BoardSetEditorDialogComponent>;

  beforeEach(waitForAsync(() => {
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
