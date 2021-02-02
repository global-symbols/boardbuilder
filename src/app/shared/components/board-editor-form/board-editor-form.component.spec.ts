import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BoardEditorFormComponent} from './board-editor-form.component';

describe('BoardEditorFormComponent', () => {
  let component: BoardEditorFormComponent;
  let fixture: ComponentFixture<BoardEditorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardEditorFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardEditorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
