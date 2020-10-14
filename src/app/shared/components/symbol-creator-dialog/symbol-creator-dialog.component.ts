import {Component, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Media} from '@data/models/media.model';
import {SymbolCreatorComponent} from '@shared/components/symbol-creator/symbol-creator.component';

export interface SymbolCreatorDialogData {
  media?: Media;
}

@Component({
  selector: 'app-symbol-creator-dialog',
  templateUrl: './symbol-creator-dialog.component.html',
  styleUrls: ['./symbol-creator-dialog.component.scss']
})
export class SymbolCreatorDialogComponent {

  media: Media;

  @ViewChild(SymbolCreatorComponent) public symbolCreator: SymbolCreatorComponent;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: SymbolCreatorDialogData,
    public dialogRef: MatDialogRef<SymbolCreatorDialogComponent>) {
    if (data.media) { this.media = data.media; }
  }

  saveAndClose() {
    this.symbolCreator.save().subscribe(media => this.dialogRef.close(media));
  }
}
