import { Component, OnInit } from '@angular/core';
import {BoardSet} from '@data/models/boardset.model';
import {BoardSetService} from '@data/services/board-set.service';
import {FormControl} from '@angular/forms';
import {Board} from '@data/models/board.model';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-new-board-set-dialog',
  templateUrl: './new-board-set-dialog.component.html',
  styleUrls: ['./new-board-set-dialog.component.scss']
})
export class NewBoardSetDialogComponent implements OnInit {

  name = new FormControl('');
  rows = new FormControl(3);
  columns = new FormControl(4);

  constructor(public dialogRef: MatDialogRef<NewBoardSetDialogComponent>,
              private service: BoardSetService
  ) { }

  ngOnInit(): void {
  }

  create(): void {
    const boardSet = new BoardSet({
      name: this.name.value,
      boards: [
        new Board({
          name: 'Board 1',
          rows: this.rows.value,
          columns: this.columns.value
        })
      ]
    });

    this.service.add(boardSet).subscribe(bs => this.dialogRef.close(bs));
  }

}
