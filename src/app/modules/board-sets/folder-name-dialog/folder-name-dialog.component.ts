import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface FolderNameDialogData {
  heading: string;
  name?: string;
}

@Component({
  selector: 'app-folder-name-dialog',
  templateUrl: './folder-name-dialog.component.html'
})
export class FolderNameDialogComponent {
  name: string;

  constructor(
    public dialogRef: MatDialogRef<FolderNameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FolderNameDialogData
  ) {
    this.name = data.name || '';
  }
}
