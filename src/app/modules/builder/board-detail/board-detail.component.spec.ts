import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {of} from 'rxjs';

import {BoardDetailComponent, SHOW_BOOK_TABS_KEY} from './board-detail.component';
import {DialogService} from '@app/services/dialog.service';
import {BoardService} from '@data/services/board.service';
import {CellActionsService} from '@data/services/cell-actions.service';
import {BoardSet} from '@data/models/boardset.model';
import {Board} from '@data/models/board.model';

describe('BoardDetailComponent', () => {
  let component: BoardDetailComponent;
  let fixture: ComponentFixture<BoardDetailComponent>;

  // Seven pages in a 12-cell book (4 rows), listed out of order, plus a back page.
  function book(): BoardSet {
    const boards: any[] = [];
    for (let i = 6; i >= 0; i--) {
      boards.push({
        id: 100 + i, name: `Page ${i + 1}`, index: i, role: 'page', rows: 4, columns: 3,
        tab_cell: { id: 900 + i, kind: 'tab', caption: `Tab ${i + 1}` }
      });
    }
    boards.push({ id: 199, name: 'Core Words', role: 'back_page', back_page_type: 'core_words', rows: 4, columns: 3 });
    return new BoardSet().deserialise({ id: 1, kind: 'book', book_columns: 3, book_rows: 4, boards });
  }

  function show(boardSet: BoardSet, board: Board) {
    component.boardSet = boardSet;
    component.board = board;
    fixture.detectChanges();
  }

  const el = (selector: string): HTMLElement => fixture.nativeElement.querySelector(selector);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardDetailComponent ],
      imports: [ MatMenuModule, NoopAnimationsModule ],
      providers: [
        { provide: DialogService, useValue: {} },
        { provide: BoardService, useValue: {} },
        { provide: CellActionsService, useValue: { canPaste$: of(false), canUndo$: of(false) } }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    localStorage.removeItem(SHOW_BOOK_TABS_KEY);
    fixture = TestBed.createComponent(BoardDetailComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => localStorage.removeItem(SHOW_BOOK_TABS_KEY));

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('puts each page tab in row page_index % rows, in its own tab column', () => {
    const b = book();
    const rows = b.pages.map(page => {
      show(b, page);
      return el('.book-tab').style.gridRow;
    });

    expect(rows.map(row => parseInt(row, 10))).toEqual([1, 2, 3, 4, 1, 2, 3]);
    expect(fixture.nativeElement.querySelectorAll('.book-tab').length).toBe(1);
    expect(el('.book-tab .book-tab-caption').textContent).toBe('Tab 7');
  });

  it('moves the tab when pages are reordered', () => {
    const b = book();
    const third = b.pages[2];
    show(b, third);
    expect(parseInt(el('.book-tab').style.gridRow, 10)).toBe(3);

    third.index = -1;
    fixture.detectChanges();
    expect(parseInt(el('.book-tab').style.gridRow, 10)).toBe(1);
  });

  it('uses the palette colour for the page position until the tab has its own', () => {
    const b = book();
    show(b, b.pages[1]);
    expect(component.tabBackground).toBe('#ED7D31');

    b.pages[1].tab_cell.background_colour = '#123456';
    expect(component.tabBackground).toBe('#123456');
  });

  it('selects the tab cell when the tab is clicked', () => {
    const b = book();
    show(b, b.pages[0]);
    const selected = spyOn(component.cellChange, 'emit');

    el('.book-tab').click();

    expect(selected).toHaveBeenCalledWith(b.pages[0].tab_cell);
    expect(b.pages[0].tab_cell.isTab).toBeTrue();
  });

  it('Show tabs off hides the tab column and is remembered', () => {
    const b = book();
    show(b, b.pages[0]);

    component.toggleBookTabs(false);
    fixture.detectChanges();

    expect(el('.book-tabs')).toBeNull();
    expect(el('.book-tabs-bar .show-tabs-toggle')).toBeTruthy('the toggle stays so tabs can be shown again');
    expect(localStorage.getItem(SHOW_BOOK_TABS_KEY)).toBe('0');

    const next = TestBed.createComponent(BoardDetailComponent).componentInstance;
    expect(next.showBookTabs).toBeFalse();
  });

  it('shows the back page placeholder on the left instead of a tab', () => {
    const b = book();
    show(b, b.backPage);

    expect(el('.board-stage').classList).toContain('back-page');
    expect(el('.book-tab')).toBeNull();
    expect(el('.book-tab-placeholder').textContent).toContain('Each page\'s tab is printed here');
    expect(el('.book-tabs-bar').classList).toContain('back-page');
  });

  it('has no book tab column or toggle for board sets', () => {
    const set = new BoardSet().deserialise({ id: 2, boards: [{ id: 5, name: 'Board', rows: 3, columns: 4 }] as any });
    show(set, set.boards[0]);

    expect(el('.book-tabs')).toBeNull();
    expect(el('.show-tabs-toggle')).toBeNull();
  });
});
