import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BoardEditorDialogComponent } from './board-editor-dialog.component';

describe('BoardEditorComponent', () => {
  let component: BoardEditorDialogComponent;
  let fixture: ComponentFixture<BoardEditorDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardEditorDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardEditorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
