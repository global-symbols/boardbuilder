import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {of} from 'rxjs';

import {NewBookDialogComponent} from './new-book-dialog.component';
import {BoardSetService} from '@data/services/board-set.service';
import {BoardSet} from '@data/models/boardset.model';

describe('NewBookDialogComponent', () => {
  let component: NewBookDialogComponent;
  let fixture: ComponentFixture<NewBookDialogComponent>;
  let service: jasmine.SpyObj<BoardSetService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<NewBookDialogComponent>>;

  beforeEach(waitForAsync(() => {
    service = jasmine.createSpyObj('BoardSetService', ['add']);
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      declarations: [ NewBookDialogComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        { provide: BoardSetService, useValue: service },
        { provide: MatDialogRef, useValue: dialogRef }
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
});
