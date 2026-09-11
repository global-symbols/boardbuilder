import {Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild} from '@angular/core';
import {Cell} from '@data/models/cell.model';
import {MatDialog} from '@angular/material/dialog';
import {BoardSet} from '@data/models/boardset.model';
import {Board} from '@data/models/board.model';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {BoardService} from '@data/services/board.service';
import {CellService} from '@data/services/cell.service';
import {CellActionsService} from '@data/services/cell-actions.service';
import {Media} from '@data/models/media.model';
import {MediaUpdateService} from '@data/services/media-update.service';
import {SearchPanelComponent} from '@shared/components/search-panel/search-panel.component';
import {SymbolSearchResult} from '@data/models/symbol-search-result';
import {palettes} from '@data/colour-picker-colours';
import {Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {User} from '@data/models/user.model';
import {UserService} from '@data/services/user.service';

@Component({
  selector: 'app-cell-editor',
  templateUrl: './cell-editor.component.html',
  styleUrls: ['./cell-editor.component.scss']
})
export class CellEditorComponent implements OnChanges, OnDestroy {

  @Input() boardSet: BoardSet;
  @Input() board: Board;
  @Input() cell: Cell;

  @Output() closed = new EventEmitter<boolean>();
  @Output() cellLinkedToBoard = new EventEmitter<boolean>();

  @ViewChild('searchPanel') searchPanel: SearchPanelComponent;

  linkableBoards$: Observable<Board[]>;
  linkedBoard: Board;

  user: User;
  userSubscription: Subscription;
  mediaUpdateSubscription: Subscription;

  colourPickerColours: Array<string>;

  constructor(
    public dialog: MatDialog,
    private cellService: CellService,
    private boardService: BoardService,
    private userService: UserService,
    private mediaUpdateService: MediaUpdateService,
    public cellActions: CellActionsService
  ) {
    this.userSubscription = userService.user$.subscribe(user => this.user = user);
    this.mediaUpdateSubscription = this.mediaUpdateService.mediaUpdated$.subscribe(media => {
      this.selectMedia(media);
    });
    this.colourPickerColours = palettes.regular;
    this.userSubscription.add(
      this.cellActions.mutated$.subscribe(cell => {
        if (this.cell && cell && this.cell.id === cell.id) {
          this.loadLinkedBoard();
          this.loadLinkableBoards();
        }
      })
    );
  }

  // When an @Input is changed...
  ngOnChanges(changes: SimpleChanges) {
    // Save the Cell to the API when the selected cell is changed, either by selecting another Cell or closing the CellEditor...
    if (changes.cell?.previousValue) {
      this.cellService.update(changes.cell.previousValue).subscribe();
    }

    // Load linkable Boards when this.cell has a value
    if (changes.cell?.currentValue) {
      this.loadLinkableBoards();
      this.loadLinkedBoard();
    }
  }

  // Save the Cell to the API when the component is destroyed
  ngOnDestroy() {
    if (this.cell) { this.saveCell(); }
    this.userSubscription.unsubscribe();
    this.mediaUpdateSubscription.unsubscribe();
  }

  loadLinkableBoards(): void {
    this.linkableBoards$ = this.cellService.get(this.cell.id, 'linkable_boards').pipe(map(cell => cell.linkable_boards));
  }

  afterCellLinkedToBoard() {
    this.saveCell(success => {
      this.cellLinkedToBoard.emit(true);
      this.loadLinkedBoard();
    });
  }

  unlinkCellFromBoard() {
    this.cell.linked_board_id = null;
    this.linkedBoard = null;

    this.saveCell(success => {
      this.cellLinkedToBoard.emit(true);
      this.loadLinkableBoards();
    });
  }

  loadLinkedBoard(): void {
    // If this Cell links to a Board, load the linked Board so we have a title, etc.
    if (this.cell.linked_board_id) {
      this.boardService.get(this.cell.linked_board_id)
        .subscribe(linkedBoard => this.linkedBoard = linkedBoard);
    }
  }

  closeEditor() {
    this.closed.emit(true);
  }

  selectSearchResult(result: SymbolSearchResult) {
    this.cell.media = null;
    this.cell.media_id = null;
    this.cell.image_url = result.imageUrl;
    this.cell.picto_id = result.pictoId;
    this.cell.picto = result.picto;

    // If the user is loaded, the picto is adaptable and preferences are set, load custom hair/skin colours
    if (this.user && result.picto?.adaptable) {
      if (this.user.default_hair_colour) { this.cell.hair_colour = this.user.default_hair_colour; }
      if (this.user.default_skin_colour) { this.cell.skin_colour = this.user.default_skin_colour; }
    }

    this.saveCell();
  }

  /**
   * Handles cell data from the new "Use as-is" workflow
   * Applies the converted cell data and closes the editor
   * @param cellData - Partial cell data from search result conversion
   */
  handleCellDataSelected(cellData: Partial<Cell>) {
    // Apply the converted data to the current cell
    this.cell.media = null;
    this.cell.media_id = null;
    this.cell.image_url = cellData.image_url;
    this.cell.picto_id = cellData.picto_id;
    this.cell.picto = cellData.picto;
    
    // Only set caption from search result if cell is completely empty
    // This preserves user-entered captions and avoids unwanted labels
    if (!this.cell.caption && !this.cell.image_url) {
      // Cell is empty, so we can optionally set a caption from search result
      // For now, let's not auto-set captions to avoid confusion
      // this.cell.caption = result.label;
    }

    // If the user is loaded, the picto is adaptable and preferences are set, load custom hair/skin colours
    if (this.user && cellData.picto?.adaptable) {
      if (this.user.default_hair_colour) { this.cell.hair_colour = this.user.default_hair_colour; }
      if (this.user.default_skin_colour) { this.cell.skin_colour = this.user.default_skin_colour; }
    }

    // Save the cell and close the editor
    this.saveCell(() => {
      this.closed.emit(true);
    });
  }

  // Fires an automatic search when the Search tab is opened.
  // Only fires if the cell has a caption we can search for.
  triggerSearch($event: MatTabChangeEvent) {
    if ($event.index === 1 && this.cell.caption) { this.searchPanel.search(); }
  }

  clearCell(subject?: 'colours' | 'symbol' | 'caption') {
    if (!subject || subject === 'colours') {
      this.cell.background_colour = null;
      this.cell.border_colour = null;
      this.cell.text_colour = null;
      this.cell.hair_colour = null;
      this.cell.skin_colour = null;
    }

    if (!subject || subject === 'symbol') {
      this.cell.image_url = null;
      this.cell.media_id = null;
      this.cell.picto_id = null;
      this.cell.media = null;
      this.cell.picto = null;
      this.cell.hair_colour = null;
      this.cell.skin_colour = null;
    }

    if (!subject || subject === 'caption') {
      this.cell.caption = null;
    }

    this.saveCell();
  }

  copyCell() {
    this.cellActions.copy(this.cell);
  }

  cutCell() {
    this.cellActions.cut(this.cell, this.board).subscribe();
  }

  pasteCell() {
    this.cellActions.paste(this.cell, this.board).subscribe();
  }

  deleteCell() {
    this.cellActions.delete(this.cell, this.board).subscribe();
  }

  undoAction() {
    this.cellActions.undo().subscribe();
  }

  // Sets the Cell's image URL for an image from the User's page library.
  selectMedia(media: Media) {
    // Remove any Picto that was present in the Cell.
    this.cell.picto_id = null;

    // Set the selected Media item instead.
    this.cell.media = media;
    this.cell.media_id = media.id;
    this.cell.image_url = media.public_url;

    this.saveCell(() => {
      this.closed.emit(true);
    });
  }

  saveCell(next?): void {
    this.cellService.update(this.cell).subscribe(next);
  }

// onMediaCreated(media: any) {
//     if (this.mediaLibrary) {
//       this.mediaLibrary.loadMedia(media); // Update MediaLibrary
//     }
//     if (this.boardEditor) {
//       this.boardEditor.loadMedia(media); // Update board cell
//     }
//   }


// onMediaCreated(media: any) {
//     console.log('onMediaCreated called with media:', media); // Debug log
//     if (this.mediaLibrary) {
//       console.log('Loading media in MediaLibrary');
//       this.mediaLibrary.loadMedia(media);
//     } else {
//       console.log('mediaLibrary is null');
//     }
//     if (this.boardEditor) {
//       console.log('Loading media in BoardEditor');
//       this.boardEditor.loadMedia(media);
//     } else {
//       console.log('boardEditor is null');
//     }
//   }

}
