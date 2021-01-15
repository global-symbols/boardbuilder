import {Component, Input, OnInit} from '@angular/core';
import {Board} from '@data/models/board.model';
import {BoardTemplate} from '@data/models/board-template.model';
import {BoardService} from '@data/services/board.service';

@Component({
  selector: 'app-board-editor-form',
  templateUrl: './board-editor-form.component.html',
  styleUrls: ['./board-editor-form.component.scss']
})
export class BoardEditorFormComponent implements OnInit {

  @Input() board: Board;

  templates: BoardTemplate[];

  constructor(
    private service: BoardService
  ) { }

  ngOnInit(): void {
    this.service.templates().subscribe(
      templates => this.templates = templates
    );
  }

  selectTemplate(template: BoardTemplate) {
    this.board.rows = template.board.rows;
    this.board.columns = template.board.columns;
    this.board.captions_position = template.board.captions_position;
    this.board.populateCells();
  }

}
