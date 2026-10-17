import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {of} from 'rxjs';

import {NewBookDialogComponent} from './new-book-dialog.component';
import {BoardSetService} from '@data/services/board-set.service';
import {BoardSet} from '@data/models/boardset.model';

describe('NewBookDialogComponent', () => {
  let component: NewBookDialogComponent;
  let fixture: ComponentFixture<NewBookDialogComponent>;
  let service: jasmine.SpyObj<BoardSetService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<NewBookDialogComponent>>;

  // Shared with the test module; Convert to book tests set a source before creating the dialog.
  const dialogData: { source?: BoardSet } = {};

  beforeEach(waitForAsync(() => {
    delete dialogData.source;
    service = jasmine.createSpyObj('BoardSetService', ['add', 'convertToBook']);
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      declarations: [ NewBookDialogComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        { provide: BoardSetService, useValue: service },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: dialogData }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBookDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('offers the 12-cell and 36-cell layouts, 12 selected', () => {
    expect(component.layouts.map(l => [l.columns, l.rows, l.cells])).toEqual([[3, 4, 12], [6, 6, 36]]);
    expect(component.selectedLayout.cells).toBe(12);
    expect(fixture.nativeElement.querySelectorAll('.layout-card').length).toBe(2);
  });

  it('draws a preview with the grid and one tab column', () => {
    const cards = fixture.nativeElement.querySelectorAll('.layout-card');

    expect(cards[0].querySelectorAll('.cell').length).toBe(12);
    expect(cards[0].querySelectorAll('.tab').length).toBe(4);
    expect(cards[1].querySelectorAll('.cell').length).toBe(36);
    expect(cards[1].querySelectorAll('.tab').length).toBe(6);
  });

  it('needs a name before creating', () => {
    component.create();

    expect(component.bookForm.invalid).toBeTrue();
    expect(service.add).not.toHaveBeenCalled();
  });

  it('creates a book with the chosen layout and closes with it', () => {
    const created = new BoardSet({ id: 5, name: 'Ali', kind: 'book', book_columns: 6, book_rows: 6 });
    service.add.and.returnValue(of(created));

    component.bookForm.patchValue({ name: '  Ali  ' });
    component.selectLayout(component.layouts[1]);
    component.create();

    const sent: BoardSet = service.add.calls.mostRecent().args[0];
    expect(sent.name).toBe('Ali');
    expect(sent.kind).toBe('book');
    expect([sent.book_columns, sent.book_rows]).toEqual([6, 6]);
    expect(sent.boards).toEqual([]);
    expect(dialogRef.close).toHaveBeenCalledWith(created);
  });

  describe('Convert to book', () => {
    const source = () => new BoardSet().deserialise({
      id: 3, name: 'Home', boards: [
        { id: 31, name: 'Core', index: 0, columns: 3, rows: 4, cells: [] },
        { id: 32, name: 'Food', index: 1, columns: 4, rows: 2, cells: [{ id: 1, linked_board_id: 31 }] },
        { id: 33, name: 'Big', index: 2, columns: 5, rows: 5, cells: [] }
      ] as any
    });

    function openConvert() {
      dialogData.source = source();
      fixture = TestBed.createComponent(NewBookDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }

    const rows = (): HTMLElement[] => Array.from(fixture.nativeElement.querySelectorAll('.report-row'));

    it('starts from the board set name and the layout most boards fit', () => {
      openConvert();

      expect(component.bookForm.value.name).toBe('Home');
      expect(component.selectedLayout.cells).toBe(12);
      expect(fixture.nativeElement.textContent).toContain('Convert to Book');
    });

    it('reports each board, failing boards first: not compatible, compatible, re-flowed (links noted)', () => {
      openConvert();

      expect(rows().map(row => row.className.match(/fit-(\w+)/)[1])).toEqual(['too_big', 'same', 'reflow']);
      expect(rows()[0].querySelector('.leave-out')).toBeTruthy();
      expect(rows()[0].textContent).toContain('Big');
      expect(rows()[2].textContent).toContain('Links to other boards will be removed');
      expect(fixture.nativeElement.querySelector('.compatibility-summary').textContent.replace(/\s+/g, ' ').trim())
        .toBe('Compatibility (2 boards pass, 1 fail)');
    });

    it('blocks Convert until boards that do not fit are left out', () => {
      openConvert();
      expect(component.blocked).toBeTrue();
      expect(fixture.nativeElement.querySelector('.submit').disabled).toBeTrue();

      component.toggleLeftOut(component.sourceBoards[2], true);
      fixture.detectChanges();

      expect(component.blocked).toBeFalse();
      expect(fixture.nativeElement.querySelector('.submit').disabled).toBeFalse();
    });

    it('a bigger layout can make every board fit', () => {
      openConvert();
      component.selectLayout(component.layouts[1]);
      fixture.detectChanges();

      expect(component.blocked).toBeFalse();
      expect(rows().map(row => row.className.match(/fit-(\w+)/)[1])).toEqual(['reflow', 'reflow', 'reflow']);
      expect(fixture.nativeElement.querySelector('.compatibility-summary').textContent.replace(/\s+/g, ' ').trim())
        .toBe('Compatibility (3 boards pass, 0 fail)');
    });

    it('converts the boards that fit into a new book and closes with it', () => {
      openConvert();
      const book = new BoardSet({ id: 50, kind: 'book', book_columns: 3, book_rows: 4 });
      service.convertToBook.and.returnValue(of(book));
      component.toggleLeftOut(component.sourceBoards[2], true);

      component.create();

      expect(service.convertToBook).toHaveBeenCalledWith(component.source, {
        name: 'Home', book_columns: 3, book_rows: 4, board_ids: [31, 32]
      });
      expect(service.add).not.toHaveBeenCalled();
      expect(dialogRef.close).toHaveBeenCalledWith(book);
    });
  });
});
