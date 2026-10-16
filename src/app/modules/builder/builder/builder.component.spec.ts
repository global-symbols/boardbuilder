import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ActivatedRoute, convertToParamMap, Router} from '@angular/router';
import {Clipboard} from '@angular/cdk/clipboard';
import {MatDialog} from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {Hotkey, HotkeysService} from '@conflito/angular2-hotkeys';
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
import {Cell} from '@data/models/cell.model';
import {TermPipe} from '@shared/pipes/term.pipe';
import {ObfObzService} from '@data/services/obf-obz.service';

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

  let hotkeys: Hotkey[];
  let obfObzService: jasmine.SpyObj<ObfObzService>;
  let dialogService: jasmine.SpyObj<DialogService>;
  let cellActions: jasmine.SpyObj<CellActionsService>;

  beforeEach(waitForAsync(() => {
    hotkeys = [];
    obfObzService = jasmine.createSpyObj('ObfObzService', ['parseBookPageObf', 'uploadInlineImagesToMedia']);
    obfObzService.uploadInlineImagesToMedia.and.callFake((set: BoardSet) => of(set));
    dialogService = jasmine.createSpyObj('DialogService', ['messageBox', 'error']);
    cellActions = jasmine.createSpyObj('CellActionsService', ['resetUndo', 'delete', 'copy', 'cut', 'paste'],
                                       { linksChanged$: new Subject() });
    boardSetService = jasmine.createSpyObj('BoardSetService', ['get', 'touch', 'addBackPage', 'bookPageObf']);
    boardSetService.touch.and.returnValue(of(null));
    boardService = jasmine.createSpyObj('BoardService', ['add', 'duplicate', 'delete']);
    toolbar = jasmine.createSpyObj('ToolbarService', ['setButtons', 'clearButtons']);

    TestBed.configureTestingModule({
      declarations: [ BuilderComponent, TermPipe ],
      imports: [ MatMenuModule, NoopAnimationsModule ],
      providers: [
        { provide: BoardSetService, useValue: boardSetService },
        { provide: BoardService, useValue: boardService },
        { provide: CellService, useValue: {} },
        { provide: HotkeysService, useValue: {
            add: (hotkey: any) => { hotkeys.push(hotkey); return hotkey; }, remove: () => {}, cheatSheetToggle: new Subject()
          } },
        { provide: ToolbarService, useValue: toolbar },
        { provide: DialogService, useValue: dialogService },
        { provide: MatDialog, useValue: {} },
        { provide: ActivatedRoute, useValue: {
            paramMap: of(convertToParamMap({ id: '1' })),
            snapshot: { paramMap: convertToParamMap({ id: '1' }), queryParamMap: convertToParamMap({}) }
          } },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
        { provide: Clipboard, useValue: {} },
        { provide: MatSnackBar, useValue: {} },
        { provide: CellActionsService, useValue: cellActions },
        { provide: ObfObzService, useValue: obfObzService }
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
    expect(toolbar.setButtons.calls.mostRecent().args[0][0].text).toBe('My Books & Board Sets');
  });

  it('keeps the board tree for board sets', () => {
    create(boardSet());

    expect(fixture.nativeElement.querySelector('app-board-tree')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-book-page-list')).toBeNull();
    expect(toolbar.setButtons.calls.mostRecent().args[0][0].text).toBe('My Books & Board Sets');
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

  it('a read-only book can still be printed and downloaded, but not changed', () => {
    const readonlyBook = book();
    readonlyBook.readonly = true;
    create(readonlyBook);
    (fixture.nativeElement.querySelector('#leftSidebarHeaderPanel button') as HTMLElement).click();
    fixture.detectChanges();
    const item = (selector: string) => document.querySelector(`.cdk-overlay-container ${selector}`) as HTMLButtonElement;

    expect(item('.print-book').disabled).toBeFalse();
    expect(item('.download-book').disabled).toBeFalse();
    expect(item('.add-page-obf').disabled).toBeTrue();
    expect(boardSetService.touch).not.toHaveBeenCalled();
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

  it('keyboard delete, cut, copy and paste ignore a selected tab', () => {
    create(book());
    component.selectCell(new Cell({ id: 900, kind: 'tab', caption: 'Tab' }));
    const press = (combo: string) => hotkeys.find(hotkey => hotkey.combo.includes(combo))
      .callback({ target: document.body } as any, combo);

    ['del', 'ctrl+c', 'ctrl+x', 'ctrl+v'].forEach(press);

    expect(cellActions.delete).not.toHaveBeenCalled();
    expect(cellActions.copy).not.toHaveBeenCalled();
    expect(cellActions.cut).not.toHaveBeenCalled();
    expect(cellActions.paste).not.toHaveBeenCalled();
  });

  describe('Add page from OBF', () => {
    const file = () => new File(['{}'], 'page.obf');
    const withBackPage = () => {
      const b = book();
      b.boards.push(new Board({ id: 199, name: 'Core Words', role: 'back_page', back_page_type: 'core_words', rows: 4, columns: 3 }));
      return b;
    };

    it('adds an imported page at the end of the book', async () => {
      create(book());
      const page = new Board({ name: 'Animals', role: 'page', rows: 4, columns: 3 });
      obfObzService.parseBookPageObf.and.returnValue({ role: 'page', board: page });
      boardService.add.and.returnValue(of(new Board({ id: 12, name: 'Animals', rows: 4, columns: 3 })));

      await component.importBookPage(file());

      expect(boardService.add).toHaveBeenCalledWith(page);
      expect(page.board_set_id).toBe(1);
    });

    it('asks before replacing the back page, and keeps it when the user cancels', async () => {
      create(withBackPage());
      obfObzService.parseBookPageObf.and.returnValue({
        role: 'back_page',
        board: new Board({ name: 'Chat', role: 'back_page', back_page_type: 'conversation_support', rows: 4, columns: 3 })
      });
      dialogService.messageBox.and.returnValue({ afterClosed: () => of(false) } as any);

      await component.importBookPage(file());

      expect(dialogService.messageBox.calls.mostRecent().args[0].heading).toBe('Replace the back page?');
      expect(boardService.delete).not.toHaveBeenCalled();
      expect(boardSetService.addBackPage).not.toHaveBeenCalled();
    });

    it('replaces the back page when the user confirms', async () => {
      create(withBackPage());
      const back = new Board({ name: 'Chat', role: 'back_page', back_page_type: 'conversation_support', rows: 4, columns: 3 });
      obfObzService.parseBookPageObf.and.returnValue({ role: 'back_page', board: back });
      dialogService.messageBox.and.returnValue({ afterClosed: () => of(true) } as any);
      boardService.delete.and.returnValue(of(null));
      boardSetService.addBackPage.and.returnValue(of(new Board({ id: 200, name: 'Chat', rows: 4, columns: 3 })));

      await component.importBookPage(file());

      expect(boardService.delete.calls.mostRecent().args[0].id).toBe(199);
      expect(boardSetService.addBackPage)
        .toHaveBeenCalledWith(component.boardSet, 'conversation_support', { name: 'Chat', cells: back.cells });
    });

    it('explains a file that cannot be added', async () => {
      create(book());
      obfObzService.parseBookPageObf.and.throwError('"Big" is 6 columns × 6 rows; this book is 3 columns × 4 rows.');

      await component.importBookPage(file());

      expect(dialogService.error.calls.mostRecent().args[0].content).toContain('"Big" is 6 columns × 6 rows');
      expect(boardService.add).not.toHaveBeenCalled();
    });
  });
});
