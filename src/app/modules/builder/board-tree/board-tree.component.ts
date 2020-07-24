import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Board} from '@data/models/board.model';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {FlatTreeControl} from '@angular/cdk/tree';

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-board-tree',
  templateUrl: './board-tree.component.html',
  styleUrls: ['./board-tree.component.scss']
})
export class BoardTreeComponent implements OnInit {

  @Input() boards: Array<Board>;
  @Input() selectedBoard: Board;
  @Output() readonly selectionChange = new EventEmitter<Board>();

  private _transformer = (node: Board, level: number) => {
    const childBoardIds = node.cells.filter(c => c.linked_board_id).map(c => c.linked_board_id);
    const children = this.boards.filter(b => childBoardIds.includes(b.id));
    return {
      expandable: !!children && children.length > 0,
      name: node.name,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => {
      const childBoardIds = node.cells.filter(c => c.linked_board_id).map(c => c.linked_board_id);
      return this.boards.filter(b => childBoardIds.includes(b.id));
      // return node.cells.filter(c => c.linked_board_id);
    });

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor() { }

  ngOnInit() {
    this.dataSource.data = this.boards;
  }

  selectBoard(board: Board) {
    this.selectionChange.emit(board);
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
}
