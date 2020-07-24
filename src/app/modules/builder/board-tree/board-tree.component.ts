import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
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
export class BoardTreeComponent implements OnInit, OnChanges {

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
    // this.dataSource.data = this.boards;
  }

  ngOnChanges(changes: SimpleChanges) {
    // Walk this.boards and reformat it into a tree
    const linkedBoardIds = new Array<number>();
    this.boards.map(b => b.cells.filter(c => c.linked_board_id));
    // console.log(this.boards.map(b => b.cells.filter(c => c.linked_board_id)));

    this.flatToHierarchy();

    this.dataSource.data = this.boards;
  }

  flatToHierarchy() {
    const roots = []; // things without parent

    // make them accessible by guid on this map
    const allBoards = {};

    const childBoardIds = [];

    this.boards.forEach((board) => {
      // Populate a list of Board IDs that are linked to by the Cells. These will be child Boards.
      board.cells.filter(cell => cell.linked_board_id != null).forEach(cell => childBoardIds.push(cell.linked_board_id));

      // Add to allBoards
      allBoards[board.id] = board;
    });

    console.log('child Boards ', childBoardIds);

    // connect children to their parents, and split roots apart
    Object.keys(allBoards).forEach((id) => {
      const board = allBoards[id];
      console.log('checking ', board);

      // const parentBoard = this.boards.filter(b => b.cells.filter(c => c.linked_board_id === board.id));
      const isRootBoard = !childBoardIds.includes(board.id);

      console.log('isRootBoard ', isRootBoard);
      // If the Board has no parent, push it to Roots
      // if (parentBoard === null) {
      if (isRootBoard) {
        roots.push(board);

      // Otherwise, push to children of the Board in allBoards. TS pass-by-reference does the rest!
      // } else if (board.parent in allBoards) {
      } else {
        // This is a child board. Find the parent.
        let boardParent: Board;
        // TODO: replace with .find or .some
        this.boards.forEach((b) => {
          if (b.cells.find(cell => cell.linked_board_id === board.id)) {
            boardParent = b;
            console.log('found parent of ', board, b);
            const parent = allBoards[boardParent.id];
            if (!('Children' in parent)) {
              parent.Children = [];
            }
            parent.Children.push(board);
            console.log('added child to parent', parent);
          }
        });
      }
    });

    console.log('roots', roots);

    // done!
    return roots;
  }

  selectBoard(board: Board) {
    this.selectionChange.emit(board);
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
}
