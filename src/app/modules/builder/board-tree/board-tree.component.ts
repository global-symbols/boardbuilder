import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';
import {Board} from '@data/models/board.model';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {FlatTreeControl} from '@angular/cdk/tree';
import {BoardEditorDialogComponent} from '@modules/builder/board-editor-dialog/board-editor-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {BoardService} from '@data/services/board.service';
import {saveAs} from 'file-saver';
import {Router} from '@angular/router';
import {BoardSet} from '@data/models/boardset.model';

/** Flat node with expandable and level information */
interface BoardTreeMenuFlatNode {
  expandable: boolean;
  board: Board;
  level: number;
}

interface BoardTreeMenuItem {
  board: Board;
  children: BoardTreeMenuItem[];
  shortestPath: BoardTreeMenuItem[];
  isRoot: boolean,
  visited: boolean
}

interface BoardTreeMenuMap {
  [key: string]: BoardTreeMenuItem;
}

@Component({
  selector: 'app-board-tree',
  templateUrl: './board-tree.component.html',
  styleUrls: ['./board-tree.component.scss']
})
export class BoardTreeComponent implements OnChanges {

  @Input() boardSet: BoardSet;
  @Input() boards: Array<Board>;
  @Input() selectedBoard: Board;
  @Output() readonly selectionChange = new EventEmitter<Board>();

  // Emitted when the user requests to delete a Board, and before the Board has been deleted.
  @Output() readonly deleteBoard = new EventEmitter<Board>();
  @Output() readonly updateBoard = new EventEmitter<Board>();

  @ViewChild('matTree') matTree;

  private currentDialogRef;

  // Padding for child tree elements, in pixels
  treeNodePadding = 20;
  initState = true;

  treeControl = new FlatTreeControl<BoardTreeMenuFlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    (node: BoardTreeMenuItem, level: number) => {
      const children = node.children;
      // only expand if at least one of the children is accessed via the shortest path
      // and not every child was already visited
      const expandable = node.isRoot || (
        !!children && children.length > 0 &&
        children.some(child => child.shortestPath[child.shortestPath.length - 1] === node) &&
        !children.every(child => child.visited)
      );
      if (expandable) {
        children.every(child => child.visited = true);
      }
      return {
        expandable: expandable,
        board: node.board,
        level,
      };
    }, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(
    public dialog: MatDialog,
    private boardService: BoardService,
    private router: Router
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    // Reload the Boards hierarchy when this.boards changes.
    if (changes.boards) { this.rebuildTree(); }
  }

  // Generates the tree and then expands all nodes
  rebuildTree(expandNodes = true): void {
    this.dataSource.data = this.flatToHierarchy();
    if (this.initState) {
      this.initState = false;
      let treeArray = this.dataSource.data || {};
      this.selectionChange.emit(treeArray[0].board);
    }
    // Expand all parts of the tree after the viewInit and after every onChanges
    if (expandNodes) { this.treeControl.expandAll(); }
  }

  private flatToHierarchy(): BoardTreeMenuItem[] {

    const allMenuItems: BoardTreeMenuMap = {};
    const menuItemsTree = new Array<BoardTreeMenuItem>();

    const childBoardIds = [];

    this.boards.forEach((board) => {
      // Populate a list of Board IDs that are linked to by the Cells. These will be child Boards.
      board.cells.filter(cell => cell.linked_board_id != null).forEach(cell => childBoardIds.push(cell.linked_board_id));

      // Populate a list of menu items
      allMenuItems[board.id] = {
        board,
        children: [],
        shortestPath: [],
        isRoot: false,
        visited: false
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

    if (menuItemsTree.length === 0) {
      let allItems = Object.values(allMenuItems);
      allItems.sort((a, b) => b.children.length - a.children.length);
      menuItemsTree.push(allItems[0]);
      menuItemsTree[0].isRoot = true;
    }

    // fill shortestPath properties
    for (let menuItem of menuItemsTree) {
      this.setShortestPaths(menuItem);
    }
    menuItemsTree.sort((a, b) => b.children.length - a.children.length);
    return menuItemsTree;
  }

  selectBoard(board: Board) {
    this.selectionChange.emit(board);
  }

  hasChild = (_: number, node: BoardTreeMenuFlatNode) => node.expandable;

  delete(board: Board) {
    this.deleteBoard.emit(board);
  }

  edit(board: Board) {
    if (this.currentDialogRef !== undefined) { return; }
    if (this.boardSet.readonly) { return; }

    this.currentDialogRef = this.dialog.open(BoardEditorDialogComponent, {
      width: '700px',
      data: { board }
    });

    this.currentDialogRef.afterClosed().subscribe(result => {
      this.currentDialogRef = undefined;
      this.boardService.update(board).subscribe(b => {
        // this.boardService.get(b.id, 'cells').subscribe(newBoard => board = newBoard);
        this.updateBoard.emit(b);
      });
    });
  }

  download(board: Board) {
    saveAs(new Blob([JSON.stringify(board.toObf(), null, 2)], {type: 'text/plain;charset=utf-8'}), board.title + '.obf');
  }

  pdf(board: any) {
    this.router.navigate(['boardsets', board.board_set_id, 'pdf', board.id]);
  }

  /**
   * Recursive function to set all shortest paths to the items within a given tree.
   * After calling this method all items have a property "shortestPath" which is an
   * array representing the shortest path from the initial item to this item.
   * @param menuItem item to start
   * @param currentParents only for recursion, current path
   * @private
   */
  private setShortestPaths(menuItem, currentParents = []) {
    if (menuItem.shortestPath.length === 0) {
      menuItem.shortestPath = currentParents;
    }
    let changedSomething = false;
    for (let child of menuItem.children) {
      if (child.shortestPath.length === 0 && !child.isRoot) {
        child.shortestPath = currentParents.concat([menuItem]);
        changedSomething = true;
      }
    }
    if (!changedSomething) {
      return;
    }
    for (let child of menuItem.children) {
      this.setShortestPaths(child, currentParents.concat([menuItem]));
    }
  }
}
