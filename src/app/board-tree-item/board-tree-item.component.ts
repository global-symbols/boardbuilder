import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Board} from '../models/board.model';

@Component({
  selector: 'app-board-tree-item',
  templateUrl: './board-tree-item.component.html',
  styleUrls: ['./board-tree-item.component.css']
})
export class BoardTreeItemComponent implements OnInit {

  @Input() board: Board;
  @Input() level = 0;
  @Output() selectChange = new EventEmitter<Board>();
  constructor() { }

  ngOnInit() {
  }

}
