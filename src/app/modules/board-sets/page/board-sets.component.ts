import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CdkOverlayOrigin, ConnectedPosition} from '@angular/cdk/overlay';
import {environment} from '@env';
import {BoardSetService} from '@data/services/board-set.service';
import {BoardSet} from '@data/models/boardset.model';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {NewBoardSetDialogComponent} from '@modules/board-sets/new-board-set-dialog/new-board-set-dialog.component';
import {NewBookDialogComponent} from '@modules/board-sets/new-book-dialog/new-book-dialog.component';
import {DialogService} from '@app/services/dialog.service';
import {ToolbarService} from '@app/services/toolbar.service';
import {ObfObzService} from '@data/services/obf-obz.service';
import {Folder} from '@data/models/folder.model';
import {FolderService} from '@data/services/folder.service';
import {FolderNameDialogComponent} from '@modules/board-sets/folder-name-dialog/folder-name-dialog.component';
import {MoveToFolderDialogComponent} from '@modules/board-sets/move-to-folder-dialog/move-to-folder-dialog.component';
import {TranslateBoardSetDialogComponent} from '@shared/components/translate-board-set-dialog/translate-board-set-dialog.component';
import {CopyBoardSetDialogComponent} from '@shared/components/copy-board-set-dialog/copy-board-set-dialog.component';

// The landing page's Board Sets / Books tab (in that order), remembered per browser by name.
export const LANDING_TAB_KEY = 'boardbuilder.landing.tab';
export const BOARD_SETS_TAB = 0;
export const BOOKS_TAB = 1;
const TAB_NAMES = ['board-sets', 'books'];
// Set once someone has opened the Books tab or dismissed the books introduction.
export const BOOKS_INTRO_SEEN_KEY = 'boardbuilder.books.introSeen';
// The Books tab's "New" badge shows to everyone until the end of 15 November 2026 (local time), on every build.
export const BOOKS_NEW_BADGE_UNTIL = new Date(2026, 10, 16);

function readFlag(key: string): boolean {
  try { return !!localStorage.getItem(key); } catch (e) { return false; }
}

@Component({
  selector: 'app-board-sets',
  templateUrl: './board-sets.component.html',
  styleUrls: ['./board-sets.component.scss']
})
export class BoardSetsComponent implements OnInit, OnDestroy {

  boardSets: BoardSet[] = [];
  featuredBoardSets: BoardSet[];
  folders: Folder[] = [];
  searchQuery = '';
  activeFolder: Folder | null = null;
  selectedTab = BOOKS_TAB;
  readonly booksTab = BOOKS_TAB;
  readonly booksDescription = $localize`:Books section description:Communication books: same-size pages with a tab on each page, printed back to back.`;
  readonly boardSetsDescription = $localize`:Board Sets section description:Collections of communication boards, in any size and layout.`;
  // The books popup sits below the Books tab, or above it if there is no room.
  readonly booksPopupPositions: ConnectedPosition[] = [
    { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 14 },
    { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -14 }
  ];
  booksTabOrigin: CdkOverlayOrigin;
  private tabRemembered = false;
  private booksIntroSeen = readFlag(BOOKS_INTRO_SEEN_KEY);
  private readonly booksIntroPreview = !environment.production &&
    new URLSearchParams(window.location.search).get('booksIntro') === 'preview';

  loading: boolean;
  private currentDialogRef;

  constructor(
    private service: BoardSetService,
    private folderService: FolderService,
    private router: Router,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private toolbarService: ToolbarService,
    private obfObzService: ObfObzService
  ) { }

  ngOnInit(): void {
    if (this.booksIntroPreview) { this.booksIntroSeen = false; }
    this.restoreTab();
    this.loadBoardSets();
    this.loadFolders();
    this.loadFeaturedBoardSets();
  }

  ngOnDestroy(): void {
    this.toolbarService.clearButtons();
  }

  // Books and board sets matching the search, or in the open folder (or unfiled).
  get visibleItems(): BoardSet[] {
    const query = this.searchQuery.trim().toLowerCase();
    let sets = this.boardSets || [];

    if (query) {
      return sets.filter(bs =>
        (bs.name || '').toLowerCase().includes(query) ||
        (bs.description || '').toLowerCase().includes(query)
      );
    }

    if (this.activeFolder) {
      return sets.filter(bs => bs.folder_id === this.activeFolder.id);
    }

    return sets.filter(bs => !bs.folder_id);
  }

  get filteredBooks(): BoardSet[] {
    return this.visibleItems.filter(bs => bs.isBook);
  }

  get filteredBoardSets(): BoardSet[] {
    return this.visibleItems.filter(bs => !bs.isBook);
  }

  // The Books tab label is drawn by the tab group after this view, so the popup attaches on the next turn.
  @ViewChild('booksTabLabel', { read: CdkOverlayOrigin })
  set booksTabLabel(origin: CdkOverlayOrigin) {
    Promise.resolve().then(() => this.booksTabOrigin = origin);
  }

  get showBooksNewBadge(): boolean {
    return this.now() < BOOKS_NEW_BADGE_UNTIL;
  }

  // Separate so tests can move the clock.
  now(): Date {
    return new Date();
  }

  // Shown until someone with no books opens the Books tab or dismisses it.
  // Outside production, ?booksIntro=preview shows it anyway, to check how it looks.
  get showBooksIntro(): boolean {
    if (this.booksIntroPreview) { return !this.booksIntroSeen; }
    return !this.loading && !this.booksIntroSeen && !this.boardSets.some(item => item.isBook);
  }

  dismissBooksIntro(): void {
    this.booksIntroSeen = true;
    try { localStorage.setItem(BOOKS_INTRO_SEEN_KEY, '1'); } catch (e) { /* storage unavailable */ }
  }

  selectTab(index: number): void {
    if (index === BOOKS_TAB) { this.dismissBooksIntro(); }
    this.selectedTab = index;
    this.tabRemembered = true;
    try { localStorage.setItem(LANDING_TAB_KEY, TAB_NAMES[index]); } catch (e) { /* storage unavailable */ }
  }

  private restoreTab(): void {
    try {
      const index = TAB_NAMES.indexOf(localStorage.getItem(LANDING_TAB_KEY));
      if (index !== -1) {
        this.selectedTab = index;
        this.tabRemembered = true;
      }
    } catch (e) { /* storage unavailable */ }
  }

  get searching(): boolean {
    return this.searchQuery.trim().length > 0;
  }

  // A folder's count on a tab: "3 books" on Books, "5 board sets" on Board Sets.
  folderCount(folder: Folder, books: boolean): string {
    const count = (this.boardSets || []).filter(bs => bs.folder_id === folder.id && bs.isBook === books).length;
    return books
      ? $localize`:folder book count|Books in a folder:${count}:count: ${count === 1 ? 'book' : 'books'}:noun:`
      : $localize`:folder board set count|Board sets in a folder:${count}:count: ${count === 1 ? 'board set' : 'board sets'}:noun:`;
  }

  folderName(boardSet: BoardSet): string {
    if (!boardSet.folder_id) { return ''; }
    const folder = this.folders.find(f => f.id === boardSet.folder_id);
    return folder ? folder.name : '';
  }

  loadBoardSets(): void {
    this.loading = true;
    this.service.list('preview_cells').subscribe(
        bs => {
          this.boardSets = bs;
          // First visit: open the tab the user has items on, Books if they have any.
          if (!this.tabRemembered) {
            this.selectedTab = bs.some(item => item.isBook) || !bs.length ? BOOKS_TAB : BOARD_SETS_TAB;
          }
        },
        error => null,
        () => this.loading = false
    );
  }

  loadFolders(): void {
    this.folderService.list().subscribe(folders => this.folders = folders);
  }

  loadFeaturedBoardSets(): void {
    this.service.featured('preview_cells').subscribe(bs => this.featuredBoardSets = bs);
  }

  openFolder(folder: Folder) {
    this.activeFolder = folder;
    this.searchQuery = '';
  }

  clearFolder() {
    this.activeFolder = null;
  }

  newFolder(): void {
    this.dialog.open(FolderNameDialogComponent, {
      width: '400px',
      data: { heading: 'New folder' }
    }).afterClosed().subscribe(name => {
      if (typeof name === 'string' && name) {
        this.folderService.add(name).subscribe(() => this.loadFolders());
      }
    });
  }

  renameFolder(folder: Folder): void {
    this.dialog.open(FolderNameDialogComponent, {
      width: '400px',
      data: { heading: 'Rename folder', name: folder.name }
    }).afterClosed().subscribe(name => {
      if (typeof name === 'string' && name) {
        folder.name = name;
        this.folderService.update(folder).subscribe(() => this.loadFolders());
      }
    });
  }

  deleteFolder(folder: Folder): void {
    this.dialogService.delete({
      heading: `Delete '${folder.name}'?`,
      content: 'Books and board sets in this folder will be unfiled. They will not be deleted.'
    }).afterClosed().subscribe(ok => {
      if (ok) {
        this.folderService.delete(folder).subscribe(() => {
          if (this.activeFolder?.id === folder.id) { this.activeFolder = null; }
          this.loadFolders();
          this.loadBoardSets();
        });
      }
    });
  }

  moveToFolder(boardSet: BoardSet): void {
    this.dialog.open(MoveToFolderDialogComponent, {
      width: '400px',
      data: { boardSet, folders: this.folders }
    }).afterClosed().subscribe(result => {
      if (result && typeof result === 'object' && 'folderId' in result) {
        this.service.moveToFolder(boardSet, result.folderId).subscribe(() => {
          this.loadBoardSets();
          this.loadFolders();
        });
      }
    });
  }

  translateBoardSet(boardSet: BoardSet): void {
    this.dialog.open(TranslateBoardSetDialogComponent, {
      width: '480px',
      data: boardSet
    });
  }

  duplicateBoardSet(boardSet: BoardSet): void {
    this.dialog.open(CopyBoardSetDialogComponent, {
      width: '300px',
      data: boardSet
    }).afterClosed().subscribe(() => this.loadBoardSets());
  }

  newBoardSet(): void {
    if (this.currentDialogRef !== undefined) { return; }
    this.selectTab(BOARD_SETS_TAB);

    this.currentDialogRef = this.dialog.open(NewBoardSetDialogComponent, {
      width: '600px'
    });

    this.currentDialogRef.afterClosed().subscribe(newBoardSet => {
      if (newBoardSet instanceof BoardSet) { this.openCreated(newBoardSet); }
      this.currentDialogRef = undefined;
    });
  }

  newBook(): void {
    if (this.currentDialogRef !== undefined) { return; }
    this.selectTab(BOOKS_TAB);

    this.currentDialogRef = this.dialog.open(NewBookDialogComponent, {
      width: '600px'
    });

    this.currentDialogRef.afterClosed().subscribe(newBook => {
      if (newBook instanceof BoardSet) { this.openCreated(newBook); }
      this.currentDialogRef = undefined;
    });
  }

  // Files a new book or board set in the open folder, if any, then opens it in the builder.
  private openCreated(boardSet: BoardSet): void {
    if (this.activeFolder) {
      this.service.moveToFolder(boardSet, this.activeFolder.id).subscribe(() => this.openBoardSet(boardSet));
    } else {
      this.openBoardSet(boardSet);
    }
  }

  // Book files become a new book from either import; this one says it expects a book.
  importBook() {
    this.uploadObz(true);
  }

  uploadObz(expectBook = false) {
    this.dialogService.uploadObz(expectBook).afterClosed().subscribe(newBoardSet => {
      if (newBoardSet instanceof BoardSet) {
        this.selectTab(newBoardSet.isBook ? BOOKS_TAB : BOARD_SETS_TAB);
        this.obfObzService.uploadInlineImagesToMedia(newBoardSet).subscribe(bs => {
          this.service.add(bs).subscribe(boardSet => this.openBoardSet(boardSet));
        });
      }
    });
  }

  openBoardSet(boardSet: BoardSet) {
    this.router.navigate(['/', 'boardsets', boardSet.id]);
  }

  deleteBoardSet(boardSet: BoardSet) {

    this.dialogService.deleteBoardSet(boardSet, {
      heading: `Delete '${boardSet.name}'?`,
      content: boardSet.isBook
        ? `The book and all its pages will be deleted. This cannot be undone.`
        : `The Board Set and all its Boards will be deleted. This cannot be undone.`,
    }).afterClosed().subscribe(result => {
      if (result) {
        this.service.delete(boardSet).subscribe(r => {
          this.loadBoardSets();
          this.loadFolders();
        });
      }
    });
  }
}
