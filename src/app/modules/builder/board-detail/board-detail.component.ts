import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Board} from '@data/models/board.model';
import {Cell} from '@data/models/cell.model';

@Component({
  selector: 'app-board-detail',
  templateUrl: './board-detail.component.html',
  styleUrls: ['./board-detail.component.scss']
})
export class BoardDetailComponent implements OnInit {

  @Input() board: Board;
  @Input() cell: Cell;
  @Output() cellChange = new EventEmitter<Cell>();

  constructor() { }

  ngOnInit() {
  }

  selectCell(cell: Cell) {
    this.cellChange.emit(cell);
  }
}
