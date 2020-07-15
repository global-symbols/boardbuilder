import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CellEditorSearchPanelComponent } from './cell-editor-search-panel.component';

describe('SymbolSearchPanelComponent', () => {
  let component: CellEditorSearchPanelComponent;
  let fixture: ComponentFixture<CellEditorSearchPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CellEditorSearchPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellEditorSearchPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
