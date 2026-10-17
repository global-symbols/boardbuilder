import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';

import {BoardSetTileComponent} from './board-set-tile.component';
import {BoardSet} from '@data/models/boardset.model';

describe('BoardSetTileComponent', () => {
  let component: BoardSetTileComponent;
  let fixture: ComponentFixture<BoardSetTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardSetTileComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  });

  function show(boardSet: BoardSet) {
    fixture = TestBed.createComponent(BoardSetTileComponent);
    component = fixture.componentInstance;
    component.boardSet = boardSet;
    fixture.detectChanges();
  }

  const icon = (): string => fixture.nativeElement.querySelector('.kind-icon').textContent.trim();

  it('should create', () => {
    show(new BoardSet({ id: 1, name: 'Home' }));
    expect(component).toBeTruthy();
  });

  it('shows the board set icon before a board set title', () => {
    show(new BoardSet({ id: 1, name: 'Home' }));

    expect(icon()).toBe('dashboard');
    expect(fixture.nativeElement.querySelector('.kind-icon').classList).toContain('board-set-icon');
    expect(fixture.nativeElement.querySelector('.book-size')).toBeNull();
  });

  it('shows the book icon and page size for a book', () => {
    show(new BoardSet({ id: 2, name: 'Ali', kind: 'book', book_columns: 3, book_rows: 4 }));

    expect(icon()).toBe('menu_book');
    expect(fixture.nativeElement.querySelector('.book-size').textContent).toContain('12');
  });
});
