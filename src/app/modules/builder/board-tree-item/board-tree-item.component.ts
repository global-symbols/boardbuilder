import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Board} from '@data/models/board.model';
import {ConfirmDialogComponent} from '@shared/components/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {BoardService} from '@data/services/board.service';
import {BoardEditorComponent} from '../../../board-editor/board-editor.component';
import { saveAs } from 'file-saver';

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

  private currentDialogRef;

  constructor(
    public dialog: MatDialog,
    private boardService: BoardService
  ) { }

  delete() {
    if (this.currentDialogRef !== undefined) { return; }

    this.currentDialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {heading: `Delete '${this.board.name}'?`, content: 'This cannot be undone.'}
    });

    this.currentDialogRef.afterClosed().subscribe(result => {

      if (result) {
        // this.selectBoard(null);

        this.boardService.delete(this.board).subscribe(r => {
          // TODO: Update other components with new BoardSet list.
          // this.boardSetService.get(this.route.snapshot.paramMap.get('id'), 'boards boards.cells').subscribe(bs => {
          //   this.boardSet = bs;
          //   this.selectBoard(this.boardSet.boards[this.boardSet.boards.length - 1]);
          // });
        });
      }

      this.currentDialogRef = undefined;
    });
  }

  edit() {
    if (this.currentDialogRef !== undefined) { return; }

    this.currentDialogRef = this.dialog.open(BoardEditorComponent, {
      width: '300px',
      data: { board: this.board }
    });

    this.currentDialogRef.afterClosed().subscribe(result => {
      this.currentDialogRef = undefined;
      this.boardService.update(this.board).subscribe();
    });
  }

  download() {
    saveAs(new Blob([JSON.stringify(this.board.toObf(), null, 2)], {type: 'text/plain;charset=utf-8'}), this.board.title + '.obf');
  }
}
