import { Component, OnInit } from '@angular/core';
import {BoardSet} from '@data/models/boardset.model';
import {BoardSetService} from '@data/services/board-set.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Board} from '@data/models/board.model';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-new-board-set-dialog',
  templateUrl: './new-board-set-dialog.component.html',
  styleUrls: ['./new-board-set-dialog.component.scss']
})
export class NewBoardSetDialogComponent implements OnInit {

  name = new FormControl('');

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  board: Board;

  constructor(
    public dialogRef: MatDialogRef<NewBoardSetDialogComponent>,
    private service: BoardSetService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.firstFormGroup = this.formBuilder.group({
      name: ['', Validators.required]
    });

    this.board = new Board({
      name: 'Board 1',
      rows: 3,
      columns: 4,
      captions_position: 'below'
    });
  }

  create(): void {
    const boardSet = new BoardSet({
      name: this.name.value,
      boards: [this.board]
    });

    this.service.add(boardSet).subscribe(bs => this.dialogRef.close(bs));
  }

}
