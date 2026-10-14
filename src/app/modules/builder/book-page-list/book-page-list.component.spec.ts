import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA, SimpleChange} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {of} from 'rxjs';

import {BookPageListComponent} from './book-page-list.component';
import {BoardService} from '@data/services/board.service';
import {BoardSetService} from '@data/services/board-set.service';
import {BoardSet} from '@data/models/boardset.model';
import {Board} from '@data/models/board.model';

describe('BookPageListComponent', () => {
  let component: BookPageListComponent;
  let fixture: ComponentFixture<BookPageListComponent>;
  let boardService: jasmine.SpyObj<BoardService>;
  let boardSetService: jasmine.SpyObj<BoardSetService>;

  function book(withBackPage: boolean, pageCount = 3): BoardSet {
    const boards: any[] = [];
    for (let i = pageCount - 1; i >= 0; i--) {
      boards.push({ id: 10 + i, name: `Page ${i + 1}`, index: i, role: 'page', rows: 4, columns: 3 });
    }
    if (withBackPage) {
      boards.push({ id: 99, name: 'Core Words', index: null, role: 'back_page', back_page_type: 'core_words', rows: 4, columns: 3 });
    }
    return new BoardSet().deserialise({ id: 1, kind: 'book', book_columns: 3, book_rows: 4, boards });
  }

  function load(boardSet: BoardSet) {
    component.boardSet = boardSet;
    component.boards = boardSet.boards;
    component.ngOnChanges({ boards: new SimpleChange(null, boardSet.boards, false) });
    fixture.detectChanges();
  }

  const text = (selector: string): string[] =>
    Array.from(fixture.nativeElement.querySelectorAll(selector)).map((el: HTMLElement) => el.textContent.trim());

  function openMenu(trigger: HTMLElement) {
    trigger.click();
    fixture.detectChanges();
  }

  const overlayButtons = (selector: string): HTMLButtonElement[] =>
    Array.from(document.querySelectorAll(`.cdk-overlay-container ${selector}`));

  beforeEach(waitForAsync(() => {
    boardService = jasmine.createSpyObj('BoardService', ['update']);
    boardSetService = jasmine.createSpyObj('BoardSetService', ['reorderBoards', 'addBackPage']);

    TestBed.configureTestingModule({
      declarations: [ BookPageListComponent ],
      imports: [ MatMenuModule, NoopAnimationsModule ],
      providers: [
        { provide: BoardService, useValue: boardService },
        { provide: BoardSetService, useValue: boardSetService },
        { provide: MatDialog, useValue: {} }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookPageListComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    document.querySelectorAll('.cdk-overlay-container').forEach(el => el.innerHTML = '');
  });

  it('lists the pages flat, numbered and in index order, without the back page', () => {
    load(book(true));

    expect(text('.pages .page-name')).toEqual(['Page 1', 'Page 2', 'Page 3']);
    expect(text('.pages .page-number')).toEqual(['1', '2', '3']);
    expect(text('.back-page .page-name')).toEqual(['Core Words']);
  });

  it('shows "No back page" with an Add back page menu offering both types', () => {
    load(book(false));

    expect(fixture.nativeElement.querySelector('.no-back-page').textContent).toContain('No back page');
    openMenu(fixture.nativeElement.querySelector('.add-back-page'));
    expect(overlayButtons('.add-back-page-option').map(b => b.textContent.trim()))
      .toEqual(['Core Words', 'Conversation Support']);
  });

  it('adds a back page of the chosen type and reports it', () => {
    load(book(false));
    const created = new Board({
      id: 99, name: 'Conversation Support', role: 'back_page', back_page_type: 'conversation_support', rows: 4, columns: 3
    });
    boardSetService.addBackPage.and.returnValue(of(created));
    const added = spyOn(component.boardAdded, 'emit');

    component.addBackPage('conversation_support');

    expect(boardSetService.addBackPage).toHaveBeenCalledWith(component.boardSet, 'conversation_support');
    expect(added).toHaveBeenCalledWith(created);
  });

  it('switches the back page type, keeping the same board', () => {
    load(book(true));
    boardService.update.and.callFake((board: Board) => of(board));
    const updated = spyOn(component.updateBoard, 'emit');

    component.changeBackPageType('conversation_support');

    const sent: Board = boardService.update.calls.mostRecent().args[0];
    expect(sent.id).toBe(99);
    expect(sent.back_page_type).toBe('conversation_support');
    expect(updated).toHaveBeenCalled();
  });

  it('offers only the other type, and removing the back page asks the builder to delete it', () => {
    load(book(true));
    const deleted = spyOn(component.deleteBoard, 'emit');

    openMenu(fixture.nativeElement.querySelector('.back-page button'));
    const changes = overlayButtons('.change-back-page-type').map(b => b.textContent);
    expect(changes.length).toBe(1);
    expect(changes[0]).toContain('Change to Conversation Support');
    overlayButtons('.remove-back-page')[0].click();

    expect(deleted).toHaveBeenCalledWith(component.backPage);
  });

  it('disables Delete on the only page', () => {
    load(book(false, 1));

    openMenu(fixture.nativeElement.querySelector('.pages button'));

    expect(overlayButtons('.delete-page')[0].disabled).toBeTrue();
  });

  it('allows Delete when there is more than one page', () => {
    load(book(false, 2));

    openMenu(fixture.nativeElement.querySelector('.pages button'));

    expect(overlayButtons('.delete-page')[0].disabled).toBeFalse();
  });

  it('reorders pages through the pages-only endpoint', () => {
    load(book(true));
    boardSetService.reorderBoards.and.returnValue(of(component.boardSet));

    component.drop({ previousIndex: 2, currentIndex: 0 } as any);

    expect(boardSetService.reorderBoards).toHaveBeenCalledWith(component.boardSet, [12, 10, 11]);
    expect(component.pages.map(page => page.index)).toEqual([0, 1, 2]);
  });
});
