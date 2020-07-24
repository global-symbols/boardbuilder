import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Board} from '@data/models/board.model';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {FlatTreeControl} from '@angular/cdk/tree';

/** Flat node with expandable and level information */
interface BoardTreeMenuFlatNode {
  expandable: boolean;
  board: Board;
  level: number;
}

interface BoardTreeMenuItem {
  board: Board;
  children: BoardTreeMenuItem[];
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

  // Padding for child tree elements, in pixels
  treeNodePadding = 20;

  treeControl = new FlatTreeControl<BoardTreeMenuFlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    (node: BoardTreeMenuItem, level: number) => {
      const children = node.children;
      return {
        expandable: !!children && children.length > 0,
        board: node.board,
        level,
      };
    }, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    // Reload the Boards hierarchy when this.boards changes.
    if (changes.boards) { this.dataSource.data = this.flatToHierarchy(); }
  }

  private flatToHierarchy(): BoardTreeMenuItem[] {

    const allMenuItems = {};
    const menuItemsTree = new Array<BoardTreeMenuItem>();

    const childBoardIds = [];

    this.boards.forEach((board) => {
      // Populate a list of Board IDs that are linked to by the Cells. These will be child Boards.
      board.cells.filter(cell => cell.linked_board_id != null).forEach(cell => childBoardIds.push(cell.linked_board_id));

      // Populate a list of menu items
      allMenuItems[board.id] = {
        board,
        children: []
      };
    });

    Object.keys(allMenuItems).forEach((id) => {
      const menuItem = allMenuItems[id];

      if (!childBoardIds.includes(menuItem.board.id)) {
        menuItemsTree.push(menuItem);
      } else {
        this.boards.forEach((b) => {
          if (b.cells.find(cell => cell.linked_board_id === menuItem.board.id)) {
            allMenuItems[b.id].children.push(menuItem);
          }
        });
      }
    });

    return menuItemsTree;
  }

  selectBoard(board: Board) {
    this.selectionChange.emit(board);
  }

  hasChild = (_: number, node: BoardTreeMenuFlatNode) => node.expandable;
}
