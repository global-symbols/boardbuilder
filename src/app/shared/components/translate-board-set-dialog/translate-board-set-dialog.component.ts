import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {BoardSet} from '@data/models/boardset.model';
import {BoardSetService} from '@data/services/board-set.service';

@Component({
  selector: 'app-translate-board-set-dialog',
  templateUrl: './translate-board-set-dialog.component.html',
  styleUrls: ['./translate-board-set-dialog.component.scss']
})
export class TranslateBoardSetDialogComponent implements OnInit {
  languages: Array<{code: string, name: string}> = [];
  language: string;
  loadingLanguages = true;
  translating = false;
  error: string;
  result: BoardSet;

  constructor(
    public dialogRef: MatDialogRef<TranslateBoardSetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public boardSet: BoardSet,
    private boardSetService: BoardSetService,
    private router: Router
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
    this.boardSetService.translate(this.boardSet, this.language).subscribe(
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

  openResult() {
    this.dialogRef.close(this.result);
    this.router.navigate(['/', 'boardsets', this.result.id]);
  }
}
