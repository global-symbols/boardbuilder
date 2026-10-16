import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {MatDialog} from '@angular/material/dialog';
import {BackPageType, Board} from '@data/models/board.model';
import {BoardSet} from '@data/models/boardset.model';
import {BoardService} from '@data/services/board.service';
import {BoardSetService} from '@data/services/board-set.service';
import {BoardEditorDialogComponent} from '@modules/builder/board-editor-dialog/board-editor-dialog.component';

// The book's left panel: ordered Pages, then the optional Back Page. Board sets use app-board-tree instead.
@Component({
  selector: 'app-book-page-list',
  templateUrl: './book-page-list.component.html',
  styleUrls: ['./book-page-list.component.scss']
})
export class BookPageListComponent implements OnChanges {

  @Input() boardSet: BoardSet;
  @Input() boards: Board[];
  @Input() selectedBoard: Board;
  @Output() readonly selectionChange = new EventEmitter<Board>();
  @Output() readonly deleteBoard = new EventEmitter<Board>();
  @Output() readonly duplicateBoard = new EventEmitter<Board>();
  @Output() readonly translateBoard = new EventEmitter<Board>();
  // Emitted after a page or the back page changed on the server, so the builder reloads the book.
  @Output() readonly updateBoard = new EventEmitter<Board>();
  // Emitted with the new back page once it is created.
  @Output() readonly boardAdded = new EventEmitter<Board>();
  // Print individual page: the builder asks for the tab row, then opens the book PDF screen.
  @Output() readonly printPage = new EventEmitter<Board>();
  // Download page / Download back page: the board as a single page OBF file.
  @Output() readonly downloadBoard = new EventEmitter<Board>();

  readonly backPageTypes: { type: BackPageType, name: string }[] = [
    { type: 'core_words', name: $localize`:core words|Back page type:Core Words` },
    { type: 'conversation_support', name: $localize`:conversation support|Back page type:Conversation Support` }
  ];

  readonly lastPageTooltip = $localize`:last page|Tooltip when the only page cannot be deleted:A book needs at least one page`;

  pages: Board[] = [];
  backPage: Board | undefined;
  private currentDialogRef;

  constructor(
    public dialog: MatDialog,
    private boardService: BoardService,
    private boardSetService: BoardSetService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.boards || changes.boardSet) {
      this.pages = this.boardSet ? this.boardSet.pages : [];
      this.backPage = this.boardSet?.backPage;
    }
  }

  get readonly(): boolean { return !!this.boardSet?.readonly; }

  get isLastPage(): boolean { return this.pages.length <= 1; }

  select(board: Board): void {
    this.selectionChange.emit(board);
  }

  drop(event: CdkDragDrop<Board[]>): void {
    if (this.readonly || event.previousIndex === event.currentIndex) { return; }
    moveItemInArray(this.pages, event.previousIndex, event.currentIndex);
    this.pages.forEach((page, index) => page.index = index);
    this.boardSetService.reorderBoards(this.boardSet, this.pages.map(page => page.id)).subscribe();
  }

  // Rename and the other page properties use the board properties dialog, without layout settings.
  edit(board: Board): void {
    if (this.readonly || this.currentDialogRef !== undefined) { return; }
    this.currentDialogRef = this.dialog.open(BoardEditorDialogComponent, {
      width: '700px',
      data: { board, bookMode: true }
    });
    this.currentDialogRef.afterClosed().subscribe(() => {
      this.currentDialogRef = undefined;
      this.boardService.update(board).subscribe(updated => this.updateBoard.emit(updated));
    });
  }

  addBackPage(type: BackPageType): void {
    if (this.readonly || this.backPage) { return; }
    this.boardSetService.addBackPage(this.boardSet, type).subscribe(backPage => this.boardAdded.emit(backPage));
  }

  // D19: switching the type keeps the back page's content.
  changeBackPageType(type: BackPageType): void {
    if (this.readonly || !this.backPage || this.backPage.back_page_type === type) { return; }
    const backPage = this.backPage;
    backPage.back_page_type = type;
    this.boardService.update(backPage).subscribe(updated => this.updateBoard.emit(updated));
  }

  backPageTypeName(type: BackPageType): string {
    return this.backPageTypes.find(option => option.type === type)?.name;
  }
}
