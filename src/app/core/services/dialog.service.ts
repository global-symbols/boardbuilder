import { Injectable } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Media} from '@data/models/media.model';
import {SymbolCreatorDialogComponent} from '@shared/components/symbol-creator-dialog/symbol-creator-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {


  currentDialog: MatDialogRef<any>;

  constructor(
    private dialog: MatDialog
  ) { }

  openSymbolCreator(media?: Media): MatDialogRef<SymbolCreatorDialogComponent> {
    this.currentDialog = this.dialog.open(SymbolCreatorDialogComponent, {
      width: '800px',
      data: {media}
    });

    return this.currentDialog;
  }
}
