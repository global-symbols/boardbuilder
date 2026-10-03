import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Board} from '@data/models/board.model';
import {BoardService, TranslateBoardMode} from '@data/services/board.service';
import {BoardSetService} from '@data/services/board-set.service';

@Component({
  selector: 'app-translate-board-dialog',
  templateUrl: './translate-board-dialog.component.html',
  styleUrls: ['./translate-board-dialog.component.scss']
})
export class TranslateBoardDialogComponent implements OnInit {
  languages: Array<{code: string, name: string}> = [];
  language: string;
  mode: TranslateBoardMode = 'copy';
  loadingLanguages = true;
  translating = false;
  error: string;
  result: Board;

  constructor(
    public dialogRef: MatDialogRef<TranslateBoardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public board: Board,
    private boardService: BoardService,
    private boardSetService: BoardSetService
  ) {}

  ngOnInit() {
    this.boardSetService.translateLanguages().subscribe(
      langs => {
        this.languages = langs;
        this.loadingLanguages = false;
      },
      () => {
        this.loadingLanguages = false;
        this.error = 'Could not load languages.';
      }
    );
  }

  translate() {
    if (!this.language || this.translating) { return; }
    this.translating = true;
    this.error = null;
    this.boardService.translate(this.board, this.language, this.mode).subscribe(
      result => {
        this.result = result;
        this.translating = false;
      },
      err => {
        this.translating = false;
        this.error = err?.error?.error || 'Translation failed.';
      }
    );
  }

  done() {
    this.dialogRef.close(this.result);
  }
}
