import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Board} from '../models/board.model';

@Component({
  selector: 'app-board-tree',
  templateUrl: './board-tree.component.html',
  styleUrls: ['./board-tree.component.css']
})
export class BoardTreeComponent {

  @Input() boards: Array<Board>;
  @Input() selectedBoard: Board;
  @Output() readonly selectionChange = new EventEmitter<Board>();

  constructor() { }

  selectBoard(board: Board) {
    this.selectionChange.emit(board);
  }
}
