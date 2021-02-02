import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {Board} from '@data/models/board.model';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {BoardTemplate} from '@data/models/board-template.model';
import {BoardService} from '@data/services/board.service';

export interface BoardEditorDialogData {
  board: Board;
}

@Component({
  selector: 'app-board-editor',
  templateUrl: './board-editor-dialog.component.html',
  styleUrls: ['./board-editor-dialog.component.scss']
})
export class BoardEditorDialogComponent implements OnInit {

  templates: BoardTemplate[];

  @Input() board: Board;
  @Output() boardChange = new EventEmitter<Board>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: BoardEditorDialogData,
    private service: BoardService
  ) { }

  ngOnInit() {
    this.service.templates().subscribe(
      templates => this.templates = templates
    );
  }

  selectTemplate(template: BoardTemplate) {
    this.data.board.rows = template.board.rows;
    this.data.board.columns = template.board.columns;
    this.data.board.captions_position = template.board.captions_position;
    this.data.board.populateCells();
  }
}
