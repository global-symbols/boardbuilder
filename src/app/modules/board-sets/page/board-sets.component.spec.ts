import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';
import {of} from 'rxjs';

import {BoardSetsComponent} from './board-sets.component';
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
      imports: [ MatMenuModule ],
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

  it('shows the Books and Board Sets sections with their own create buttons', () => {
    const page: HTMLElement = fixture.nativeElement;

    expect(page.querySelector('h2').textContent).toContain('My Books & Board Sets');
    expect(page.querySelector('.books .add-book').textContent).toContain('Create Book');
    expect(page.querySelector('.board-sets .add-boardset').textContent).toContain('Create Board Set');
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
});
