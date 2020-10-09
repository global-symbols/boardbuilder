import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSymbolDialogComponent } from './add-symbol-dialog.component';

describe('AddSymbolDialogComponent', () => {
  let component: AddSymbolDialogComponent;
  let fixture: ComponentFixture<AddSymbolDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSymbolDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSymbolDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
