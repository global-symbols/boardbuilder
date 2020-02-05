import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SymbolSearchPanelComponent } from './symbol-search-panel.component';

describe('SymbolSearchPanelComponent', () => {
  let component: SymbolSearchPanelComponent;
  let fixture: ComponentFixture<SymbolSearchPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SymbolSearchPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SymbolSearchPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
