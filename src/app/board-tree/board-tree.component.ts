import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges, ViewChild} from '@angular/core';
import {Board} from '../models/board.model';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTree, MatTreeNestedDataSource} from '@angular/material';
import {BoardSet} from '../models/boardset.model';
import {Observable} from 'rxjs';
import {CollectionViewer} from '@angular/cdk/collections';

@Component({
  selector: 'app-board-tree',
  templateUrl: './board-tree.component.html',
  styleUrls: ['./board-tree.component.css']
})
export class BoardTreeComponent implements OnInit {

  private BOARDS;
  @Input()
  set boards(val: Array<Board>) {
    console.log('boards changed', val);
    this.BOARDS = val;
    this.dataSource.data = null;
    this.dataSource.data = val.concat([]);
  }

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
    // console.log(this.boards);
    // this.updateDataSource();
  }

  // updateDataSource() {
  //   this.dataSource.data = this.BOARDS;
  // }

  // ngOnChanges(changes: SimpleChanges) {
  //   console.log('ngOnChanges', changes);
  //   const currentItem: SimpleChange = changes.boards;
  //   // console.log('prev value: ', currentItem.previousValue);
  //   console.log('got item: ', currentItem.currentValue);
  //   if (currentItem.currentValue) { this.dataSource.data = this.boardss.boards; }
  // }

  selectBoard(board: Board) {
    console.log('selecting ', board);
    this.selectionChange.emit(board);
  }

}
