import {Component, OnDestroy, OnInit} from '@angular/core';
import {BoardSetService} from '@data/services/board-set.service';
import {BoardSet} from '@data/models/boardset.model';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {NewBoardSetDialogComponent} from '@modules/board-sets/new-board-set-dialog/new-board-set-dialog.component';
import {DialogService} from '@app/services/dialog.service';
import {ToolbarService} from '@app/services/toolbar.service';
import {ObfObzService} from '@data/services/obf-obz.service';
import {Folder} from '@data/models/folder.model';
import {FolderService} from '@data/services/folder.service';
import {FolderNameDialogComponent} from '@modules/board-sets/folder-name-dialog/folder-name-dialog.component';
import {MoveToFolderDialogComponent} from '@modules/board-sets/move-to-folder-dialog/move-to-folder-dialog.component';
import {TranslateBoardSetDialogComponent} from '@shared/components/translate-board-set-dialog/translate-board-set-dialog.component';

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
    this.loadBoardSets();
    this.loadFolders();
    this.loadFeaturedBoardSets();
  }

  ngOnDestroy(): void {
    this.toolbarService.clearButtons();
  }

  get filteredBoardSets(): BoardSet[] {
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

  get searching(): boolean {
    return this.searchQuery.trim().length > 0;
  }

  folderName(boardSet: BoardSet): string {
    if (!boardSet.folder_id) { return ''; }
    const folder = this.folders.find(f => f.id === boardSet.folder_id);
    return folder ? folder.name : '';
  }

  loadBoardSets(): void {
    this.loading = true;
    this.service.list('preview_cells').subscribe(
        bs => this.boardSets = bs,
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
      content: 'Board Sets in this folder will be unfiled. They will not be deleted.'
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

  newBoardSet(): void {
    if (this.currentDialogRef !== undefined) { return; }

    this.currentDialogRef = this.dialog.open(NewBoardSetDialogComponent, {
      width: '600px'
    });

    this.currentDialogRef.afterClosed().subscribe(newBoardSet => {
      if (newBoardSet instanceof BoardSet) {
        if (this.activeFolder) {
          this.service.moveToFolder(newBoardSet, this.activeFolder.id).subscribe(() => {
            this.router.navigate(['/', 'boardsets', newBoardSet.id]);
          });
        } else {
          this.router.navigate(['/', 'boardsets', newBoardSet.id]);
        }
      }

      this.currentDialogRef = undefined;
    });
  }

  uploadObz() {
    this.dialogService.uploadObz().afterClosed().subscribe(newBoardSet => {
      if (newBoardSet instanceof BoardSet) {
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
      content: `The Board Set and all its Boards will be deleted. This cannot be undone.`,
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
