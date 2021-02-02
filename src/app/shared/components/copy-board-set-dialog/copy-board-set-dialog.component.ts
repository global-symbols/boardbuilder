import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BoardSetService} from '@data/services/board-set.service';
import {BoardSet} from '@data/models/boardset.model';
import {Router} from '@angular/router';

export enum BoardSetCopyStatus {
  Confirming = 'Confirming',
  Copying = 'Copying',
  Copied = 'Copied'
}

@Component({
  selector: 'app-copy-board-set-dialog',
  templateUrl: './copy-board-set-dialog.component.html',
  styleUrls: ['./copy-board-set-dialog.component.scss']
})
export class CopyBoardSetDialogComponent {

  status: BoardSetCopyStatus;

  copiedBoardSet: BoardSet;

  constructor(public dialogRef: MatDialogRef<CopyBoardSetDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public boardSet: BoardSet,
              private service: BoardSetService,
              private router: Router
  ) {
    this.status = BoardSetCopyStatus.Confirming;
  }

  copyBoardSet(): void {
    this.status = BoardSetCopyStatus.Copying;
    this.service.add(this.boardSet).subscribe(bs => {
      this.copiedBoardSet = bs;
      this.status = BoardSetCopyStatus.Copied;
    });
  }

  openCopiedBoardSet() {
    this.router.navigate(['/', 'boardsets', this.copiedBoardSet.id]);
    this.dialogRef.close();
  }
}
