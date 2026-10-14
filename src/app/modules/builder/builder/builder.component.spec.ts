import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ActivatedRoute, convertToParamMap, Router} from '@angular/router';
import {Clipboard} from '@angular/cdk/clipboard';
import {MatDialog} from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {HotkeysService} from '@conflito/angular2-hotkeys';
import {of, Subject} from 'rxjs';

import {BuilderComponent} from './builder.component';
import {BoardSetService} from '@data/services/board-set.service';
import {BoardService} from '@data/services/board.service';
import {CellService} from '@data/services/cell.service';
import {ToolbarService} from '@app/services/toolbar.service';
import {DialogService} from '@app/services/dialog.service';
import {CellActionsService} from '@data/services/cell-actions.service';
import {BoardSet} from '@data/models/boardset.model';
import {Board} from '@data/models/board.model';
import {TermPipe} from '@shared/pipes/term.pipe';

describe('BuilderComponent', () => {
  let component: BuilderComponent;
  let fixture: ComponentFixture<BuilderComponent>;
  let boardSetService: jasmine.SpyObj<BoardSetService>;
  let boardService: jasmine.SpyObj<BoardService>;
  let toolbar: jasmine.SpyObj<ToolbarService>;

  const book = () => new BoardSet().deserialise({
    id: 1, name: 'Ali', kind: 'book', book_columns: 3, book_rows: 4,
    boards: [
      { id: 11, name: 'Second', index: 1, role: 'page', rows: 4, columns: 3 },
      { id: 10, name: 'First', index: 0, role: 'page', rows: 4, columns: 3 }
    ] as any
  });
  const boardSet = () => new BoardSet().deserialise({
    id: 2, name: 'Home', boards: [{ id: 20, name: 'Board 1', index: 0, rows: 3, columns: 4 }] as any
  });

  function create(loaded: BoardSet) {
    boardSetService.get.and.returnValue(of(loaded));
    fixture = TestBed.createComponent(BuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  function menuItems(): string[] {
    (fixture.nativeElement.querySelector('#leftSidebarHeaderPanel button') as HTMLElement).click();
    fixture.detectChanges();
    return Array.from(document.querySelectorAll('.cdk-overlay-container .mat-menu-item'))
      .map((el: HTMLElement) => el.textContent.replace(/\s+/g, ' ').trim());
  }

  beforeEach(waitForAsync(() => {
    boardSetService = jasmine.createSpyObj('BoardSetService', ['get', 'touch']);
    boardSetService.touch.and.returnValue(of(null));
    boardService = jasmine.createSpyObj('BoardService', ['add', 'duplicate']);
    toolbar = jasmine.createSpyObj('ToolbarService', ['setButtons', 'clearButtons']);

    TestBed.configureTestingModule({
      declarations: [ BuilderComponent, TermPipe ],
      imports: [ MatMenuModule, NoopAnimationsModule ],
      providers: [
        { provide: BoardSetService, useValue: boardSetService },
        { provide: BoardService, useValue: boardService },
        { provide: CellService, useValue: {} },
        { provide: HotkeysService, useValue: { add: (hotkey: any) => hotkey, remove: () => {}, cheatSheetToggle: new Subject() } },
        { provide: ToolbarService, useValue: toolbar },
        { provide: DialogService, useValue: {} },
        { provide: MatDialog, useValue: {} },
        { provide: ActivatedRoute, useValue: {
            paramMap: of(convertToParamMap({ id: '1' })),
            snapshot: { paramMap: convertToParamMap({ id: '1' }), queryParamMap: convertToParamMap({}) }
          } },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
        { provide: Clipboard, useValue: {} },
        { provide: MatSnackBar, useValue: {} },
        { provide: CellActionsService, useValue: { resetUndo: () => {}, linksChanged$: new Subject() } }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  afterEach(() => {
    document.querySelectorAll('.cdk-overlay-container').forEach(el => el.innerHTML = '');
  });

  it('opens a book on its first page and shows the page list', () => {
    create(book());

    expect(component.board.name).toBe('First');
    expect(fixture.nativeElement.querySelector('app-book-page-list')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-board-tree')).toBeNull();
    expect(toolbar.setButtons.calls.mostRecent().args[0][0].text).toBe('Books');
  });

  it('keeps the board tree for board sets', () => {
    create(boardSet());

    expect(fixture.nativeElement.querySelector('app-board-tree')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-book-page-list')).toBeNull();
    expect(toolbar.setButtons.calls.mostRecent().args[0][0].text).toBe('Board Sets');
  });

  it('book menu: Print book and Download book, no OBF, OBZ or tab settings', () => {
    create(book());
    const items = menuItems();

    expect(items.some(item => item.endsWith('Print book'))).toBeTrue();
    expect(items.some(item => item.endsWith('Download book'))).toBeTrue();
    expect(items.some(item => item.endsWith('Duplicate book'))).toBeTrue();
    expect(items.some(item => item.includes('Add Board from OBF'))).toBeFalse();
    expect(items.some(item => item.includes('Download Board Set as OBZ'))).toBeFalse();
    expect(items.some(item => item.includes('Tab Printer Settings'))).toBeFalse();
  });

  it('board set menu is unchanged', () => {
    create(boardSet());
    const items = menuItems();

    expect(items.some(item => item.includes('Add Board from OBF'))).toBeTrue();
    expect(items.some(item => item.includes('Download Board Set as OBZ'))).toBeTrue();
    expect(items.some(item => item.includes('Print book'))).toBeFalse();
  });

  it('adds "Page n" to a book in the book layout, without a dialog', () => {
    create(book());
    boardService.add.and.returnValue(of(new Board({ id: 12, name: 'Page 3', rows: 4, columns: 3 })));

    component.addBoard();

    const sent: Board = boardService.add.calls.mostRecent().args[0];
    expect(sent.name).toBe('Page 3');
    expect([sent.columns, sent.rows]).toEqual([3, 4]);
    expect(sent.board_set_id).toBe(1);
  });
});
