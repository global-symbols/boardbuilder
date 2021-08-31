import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellEditorColourPanelComponent } from './cell-editor-colour-panel.component';

describe('CellEditorColourPanelComponent', () => {
  let component: CellEditorColourPanelComponent;
  let fixture: ComponentFixture<CellEditorColourPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CellEditorColourPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CellEditorColourPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
