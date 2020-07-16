import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {BoardSet} from '@data/models/boardset.model';

export interface BoardsetEditorDialogData {
  boardSet: BoardSet;
}

@Component({
  selector: 'app-boardset-editor-dialog',
  templateUrl: './boardset-editor-dialog.component.html',
  styleUrls: ['./boardset-editor-dialog.component.scss']
})
export class BoardsetEditorDialogComponent implements OnInit {

  @Input() boardSet: BoardSet;
  @Output() boardSetChange = new EventEmitter<BoardSet>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: BoardsetEditorDialogData) { }

  ngOnInit(): void {
  }

}
