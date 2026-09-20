import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {BoardSet} from '@data/models/boardset.model';
import {BoardSetService} from '@data/services/board-set.service';
import {DialogService} from '@app/services/dialog.service';
import {Media} from '@data/models/media.model';

export interface TabRow {
  id: number;
  name: string;
  tab_enabled: boolean;
  tab_label: string;
  tab_colour: string;
  tab_image_url: string;
}

@Component({
  selector: 'app-enable-tabs-dialog',
  templateUrl: './enable-tabs-dialog.component.html',
  styleUrls: ['./enable-tabs-dialog.component.scss']
})
export class EnableTabsDialogComponent {
  enabled = false;
  edge: 'top' | 'bottom' | 'left' | 'right';
  rows: TabRow[] = [];
  saving = false;
  error: string;

  constructor(
    public dialogRef: MatDialogRef<EnableTabsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public boardSet: BoardSet,
    private boardSetService: BoardSetService,
    private dialogService: DialogService
  ) {
    this.enabled = boardSet.catalogue_tabs === true;
    this.edge = boardSet.tab_edge || 'right';
    const boards = (boardSet.boards || []).slice().sort((a, b) => {
      const ap = a.tab_position != null ? a.tab_position : (a.index || 0);
      const bp = b.tab_position != null ? b.tab_position : (b.index || 0);
      return ap - bp || (a.id || 0) - (b.id || 0);
    });
    this.rows = boards.map(board => ({
      id: board.id,
      name: board.name,
      tab_enabled: board.tab_enabled !== false,
      tab_label: board.tab_label || board.name,
      tab_colour: board.tab_colour || '#4472C4',
      tab_image_url: board.tab_image_url || ''
    }));
  }

  drop(event: CdkDragDrop<TabRow[]>) {
    moveItemInArray(this.rows, event.previousIndex, event.currentIndex);
  }

  pickSymbol(row: TabRow) {
    this.dialogService.openMediaLibrary({
      sources: ['symbols', 'user_media'],
      allowClear: true
    }).afterClosed().subscribe((media: Media) => {
      if (media === undefined) { return; }
      row.tab_image_url = media.public_url || '';
    });
  }

  save() {
    if (this.saving) { return; }
    this.saving = true;
    this.error = null;
    this.boardSetService.saveTabs(this.boardSet.id, {
      catalogue_tabs: this.enabled,
      tab_edge: this.edge,
      boards: this.rows.map((row, i) => ({
        id: row.id,
        tab_enabled: row.tab_enabled,
        tab_label: row.tab_label,
        tab_colour: row.tab_colour,
        tab_position: i,
        tab_image_url: row.tab_image_url || ''
      }))
    }).subscribe(
      result => {
        this.saving = false;
        this.dialogRef.close(result);
      },
      err => {
        this.saving = false;
        this.error = err?.error?.error || 'Could not save tab settings.';
      }
    );
  }
}
