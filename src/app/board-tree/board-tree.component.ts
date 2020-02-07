import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Board} from '../models/board.model';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material';

@Component({
  selector: 'app-board-tree',
  templateUrl: './board-tree.component.html',
  styleUrls: ['./board-tree.component.css']
})
export class BoardTreeComponent implements OnInit {

  @Input() boards: Array<Board>;

  @Output() readonly selectionChange = new EventEmitter<Board>();

  treeControl = new NestedTreeControl<Board>(parentBoard => {
    const children = [];
    parentBoard.cells.map(c => {
      if (c.board) { children.push(c.board); }
    });
    return children;
  });
  dataSource = new MatTreeNestedDataSource<Board>();

  constructor() { }

  hasChild = (_: number, node: Board) => !!node.childBoards() && node.childBoards().length > 0;

  ngOnInit() {
    console.log(this.boards);
    this.dataSource.data = this.boards;
  }

  selectBoard(board: Board) {
    this.selectionChange.emit(board);
  }

}
