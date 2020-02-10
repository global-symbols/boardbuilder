import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Board} from '../models/board.model';

@Component({
  selector: 'app-board-tree',
  templateUrl: './board-tree.component.html',
  styleUrls: ['./board-tree.component.css']
})
export class BoardTreeComponent {

  @Input() boards: Array<Board>;
  @Output() readonly selectionChange = new EventEmitter<Board>();

  constructor() { }

  selectBoard(board: Board) {
    this.selectionChange.emit(board);
  }
}
