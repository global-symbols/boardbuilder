import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SymbolSearchDialogComponent } from './symbol-search-dialog.component';

describe('SymbolSearchDialogComponent', () => {
  let component: SymbolSearchDialogComponent;
  let fixture: ComponentFixture<SymbolSearchDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SymbolSearchDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SymbolSearchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
