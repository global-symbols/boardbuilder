import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SymbolCreatorDialogComponent } from './symbol-creator-dialog.component';

describe('SymbolCreatorDialogComponent', () => {
  let component: SymbolCreatorDialogComponent;
  let fixture: ComponentFixture<SymbolCreatorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SymbolCreatorDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SymbolCreatorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
