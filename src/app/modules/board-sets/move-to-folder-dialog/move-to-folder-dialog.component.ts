import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Folder} from '@data/models/folder.model';
import {BoardSet} from '@data/models/boardset.model';

export interface MoveToFolderDialogData {
  boardSet: BoardSet;
  folders: Folder[];
}

@Component({
  selector: 'app-move-to-folder-dialog',
  templateUrl: './move-to-folder-dialog.component.html'
})
export class MoveToFolderDialogComponent {
  folderId: number | null;

  constructor(
    public dialogRef: MatDialogRef<MoveToFolderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MoveToFolderDialogData
  ) {
    this.folderId = data.boardSet.folder_id || null;
  }
}
