import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {Board} from '@data/models/board.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface BoardEditorDialogData {
  board: Board;
}

@Component({
  selector: 'app-board-editor',
  templateUrl: './board-editor.component.html',
  styleUrls: ['./board-editor.component.css']
})
export class BoardEditorComponent implements OnInit {

  @Input() board: Board;
  @Output() boardChange = new EventEmitter<Board>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: BoardEditorDialogData) { }

  ngOnInit() {
  }

}
