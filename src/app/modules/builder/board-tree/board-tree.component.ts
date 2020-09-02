import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Board} from '@data/models/board.model';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {FlatTreeControl} from '@angular/cdk/tree';
import {BoardEditorDialogComponent} from '@modules/builder/board-editor-dialog/board-editor-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {BoardService} from '@data/services/board.service';
import {saveAs} from 'file-saver';
import {Router} from '@angular/router';

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

  // Emitted when the user requests to delete a Board, and before the Board has been deleted.
  @Output() readonly deleteBoard = new EventEmitter<Board>();

  private currentDialogRef;

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

  constructor(
    public dialog: MatDialog,
    private boardService: BoardService,
    private router: Router
  ) { }

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

  delete(board: Board) {
    this.deleteBoard.emit(board);
  }

  edit(board: Board) {
    console.log(board);
    if (this.currentDialogRef !== undefined) { return; }

    this.currentDialogRef = this.dialog.open(BoardEditorDialogComponent, {
      width: '300px',
      data: { board }
    });

    this.currentDialogRef.afterClosed().subscribe(result => {
      this.currentDialogRef = undefined;
      this.boardService.update(board).subscribe();
    });
  }

  download(board: Board) {
    saveAs(new Blob([JSON.stringify(board.toObf(), null, 2)], {type: 'text/plain;charset=utf-8'}), board.title + '.obf');
  }

  pdf(board: any) {
    this.router.navigate(['boardsets', board.board_set_id, 'pdf', board.id]);
  }
}
