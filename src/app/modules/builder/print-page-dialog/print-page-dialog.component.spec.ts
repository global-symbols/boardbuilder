import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import {PrintPageDialogComponent} from './print-page-dialog.component';
import {BoardSet} from '@data/models/boardset.model';

describe('PrintPageDialogComponent', () => {
  let fixture: ComponentFixture<PrintPageDialogComponent>;
  let component: PrintPageDialogComponent;
  let dialogRef: jasmine.SpyObj<MatDialogRef<PrintPageDialogComponent>>;

  function book(withBackPage: boolean): BoardSet {
    const boards: any[] = [0, 1, 2, 3, 4, 5].map(i => ({ id: 10 + i, name: `Page ${i + 1}`, index: i, role: 'page', rows: 4, columns: 3 }));
    if (withBackPage) { boards.push({ id: 99, name: 'Core Words', role: 'back_page', back_page_type: 'core_words', rows: 4, columns: 3 }); }
    return new BoardSet().deserialise({ id: 1, kind: 'book', book_columns: 3, book_rows: 4, boards });
  }

  function open(withBackPage: boolean, pageIndex: number) {
    const b = book(withBackPage);
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: { book: b, page: b.pages[pageIndex] } });
    fixture = TestBed.createComponent(PrintPageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  beforeEach(waitForAsync(() => {
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    TestBed.configureTestingModule({
      declarations: [ PrintPageDialogComponent ],
      imports: [ FormsModule, MatRadioModule, MatCheckboxModule, NoopAnimationsModule ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();
  }));

  it('offers every row and pre-selects the page\'s book row', () => {
    open(true, 5);

    expect(component.rows).toEqual([1, 2, 3, 4]);
    expect(component.bookRow).toBe(2);
    expect(component.selectedRow).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('(book position)');
    expect(fixture.nativeElement.textContent).not.toContain('No tab');
  });

  it('includes the back page by default when the book has one', () => {
    open(true, 0);

    expect(fixture.nativeElement.querySelector('.include-back-page')).toBeTruthy();
    component.selectedRow = 3;
    component.continue();

    expect(dialogRef.close).toHaveBeenCalledWith({ tabRow: 3, includeBackPage: true });
  });

  it('hides the back page option and never asks for it when the book has none', () => {
    open(false, 0);

    expect(fixture.nativeElement.querySelector('.include-back-page')).toBeNull();
    component.continue();

    expect(dialogRef.close).toHaveBeenCalledWith({ tabRow: 1, includeBackPage: false });
  });

  it('marks the chosen row in the sketch', () => {
    open(true, 0);
    component.selectedRow = 4;
    fixture.detectChanges();

    const tabs = fixture.nativeElement.querySelectorAll('.sketch-tab');
    expect(tabs.length).toBe(4);
    expect(tabs[3].classList).toContain('filled');
    expect(fixture.nativeElement.querySelectorAll('.sketch-cell').length).toBe(12);
  });
});
