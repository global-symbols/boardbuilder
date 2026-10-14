import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';
import {MatTabsModule} from '@angular/material/tabs';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {of} from 'rxjs';

import {BOARD_SETS_TAB, BoardSetsComponent, LANDING_TAB_KEY} from './board-sets.component';
import {BoardSetService} from '@data/services/board-set.service';
import {FolderService} from '@data/services/folder.service';
import {DialogService} from '@app/services/dialog.service';
import {ToolbarService} from '@app/services/toolbar.service';
import {ObfObzService} from '@data/services/obf-obz.service';
import {BoardSet} from '@data/models/boardset.model';
import {NewBookDialogComponent} from '@modules/board-sets/new-book-dialog/new-book-dialog.component';

describe('BoardSetsComponent', () => {
  let component: BoardSetsComponent;
  let fixture: ComponentFixture<BoardSetsComponent>;
  let boardSetService: jasmine.SpyObj<BoardSetService>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let router: jasmine.SpyObj<Router>;

  const book = new BoardSet({ id: 1, name: 'Ali book', kind: 'book', book_columns: 3, book_rows: 4 });
  const filedBook = new BoardSet({ id: 2, name: 'Filed book', kind: 'book', book_columns: 6, book_rows: 6, folder_id: 9 });
  const boardSet = new BoardSet({ id: 3, name: 'Home boards' });
  const filedBoardSet = new BoardSet({ id: 4, name: 'Filed boards', folder_id: 9 });

  beforeEach(waitForAsync(() => {
    boardSetService = jasmine.createSpyObj('BoardSetService', ['list', 'featured', 'moveToFolder']);
    boardSetService.list.and.returnValue(of([book, filedBook, boardSet, filedBoardSet]));
    boardSetService.featured.and.returnValue(of([]));
    boardSetService.moveToFolder.and.returnValue(of(book));
    dialog = jasmine.createSpyObj('MatDialog', ['open']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [ BoardSetsComponent ],
      imports: [ MatMenuModule, MatTabsModule, NoopAnimationsModule ],
      providers: [
        { provide: BoardSetService, useValue: boardSetService },
        { provide: FolderService, useValue: { list: () => of([]) } },
        { provide: Router, useValue: router },
        { provide: MatDialog, useValue: dialog },
        { provide: DialogService, useValue: {} },
        { provide: ToolbarService, useValue: { clearButtons: () => {} } },
        { provide: ObfObzService, useValue: {} }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    localStorage.removeItem(LANDING_TAB_KEY);
    fixture = TestBed.createComponent(BoardSetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('lists unfiled books and board sets in separate sections', () => {
    expect(component.filteredBooks).toEqual([book]);
    expect(component.filteredBoardSets).toEqual([boardSet]);
  });

  it('keeps both sections inside a folder', () => {
    component.openFolder({ id: 9, name: 'School' } as any);

    expect(component.filteredBooks).toEqual([filedBook]);
    expect(component.filteredBoardSets).toEqual([filedBoardSet]);
  });

  it('searches books and board sets across folders', () => {
    component.searchQuery = 'filed';

    expect(component.filteredBooks).toEqual([filedBook]);
    expect(component.filteredBoardSets).toEqual([filedBoardSet]);
  });

  it('shows Books and Board Sets on tabs with counts, each with its own create card', async () => {
    const page: HTMLElement = fixture.nativeElement;
    const labels = Array.from(page.querySelectorAll('.mat-tab-label')).map(el => el.textContent.replace(/\s+/g, ' ').trim());

    expect(page.querySelector('h2').textContent).toContain('My Books & Board Sets');
    expect(labels.length).toBe(2);
    expect(labels[0]).toContain('Books (1)');
    expect(labels[1]).toContain('Board Sets (1)');
    expect(page.querySelector('.books .add-book').textContent).toContain('Create Book');
    expect(page.querySelector('.board-sets')).toBeNull('only the open tab is drawn');

    component.selectTab(BOARD_SETS_TAB);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(page.querySelector('.board-sets .add-boardset').textContent).toContain('Create Board Set');
  });

  it('remembers the chosen tab per browser', () => {
    component.selectTab(BOARD_SETS_TAB);
    expect(localStorage.getItem(LANDING_TAB_KEY)).toBe(String(BOARD_SETS_TAB));

    const next = TestBed.createComponent(BoardSetsComponent);
    next.detectChanges();
    expect(next.componentInstance.selectedTab).toBe(BOARD_SETS_TAB);
  });

  it('opens on Board Sets the first time for someone with no books', () => {
    localStorage.removeItem(LANDING_TAB_KEY);
    boardSetService.list.and.returnValue(of([boardSet, filedBoardSet]));

    const next = TestBed.createComponent(BoardSetsComponent);
    next.detectChanges();

    expect(next.componentInstance.selectedTab).toBe(BOARD_SETS_TAB);
  });

  it('opens a created book in the builder', () => {
    const created = new BoardSet({ id: 7, name: 'New', kind: 'book', book_columns: 3, book_rows: 4 });
    dialog.open.and.returnValue({ afterClosed: () => of(created) } as any);

    component.newBook();

    expect(dialog.open).toHaveBeenCalledWith(NewBookDialogComponent, jasmine.any(Object));
    expect(router.navigate).toHaveBeenCalledWith(['/', 'boardsets', 7]);
  });

  it('files a created book in the open folder first', () => {
    const created = new BoardSet({ id: 7, name: 'New', kind: 'book', book_columns: 3, book_rows: 4 });
    dialog.open.and.returnValue({ afterClosed: () => of(created) } as any);
    component.openFolder({ id: 9, name: 'School' } as any);

    component.newBook();

    expect(boardSetService.moveToFolder).toHaveBeenCalledWith(created, 9);
    expect(router.navigate).toHaveBeenCalledWith(['/', 'boardsets', 7]);
  });

  afterEach(() => localStorage.removeItem(LANDING_TAB_KEY));
});
