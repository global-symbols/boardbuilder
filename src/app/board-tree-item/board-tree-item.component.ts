import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Board} from '@data/models/board.model';

@Component({
  selector: 'app-board-tree-item',
  templateUrl: './board-tree-item.component.html',
  styleUrls: ['./board-tree-item.component.css']
})
export class BoardTreeItemComponent {

  @Input() board: Board;
  @Input() level = 0;
  @Input() selectedBoard: Board;
  @Output() selectChange = new EventEmitter<Board>();

  constructor() { }

}
