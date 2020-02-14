import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {Board} from '../models/board.model';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {BoardEditorDialogData} from '../board-editor/board-editor.component';
import {BoardSet} from '../models/boardset.model';

export interface BoardsetEditorDialogData {
  boardSet: BoardSet;
}

@Component({
  selector: 'app-boardset-editor-dialog',
  templateUrl: './boardset-editor-dialog.component.html',
  styleUrls: ['./boardset-editor-dialog.component.css']
})
export class BoardsetEditorDialogComponent implements OnInit {

  @Input() boardSet: BoardSet;
  @Output() boardSetChange = new EventEmitter<BoardSet>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: BoardsetEditorDialogData) { }

  ngOnInit(): void {
  }

}
