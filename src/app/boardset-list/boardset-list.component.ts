import { Component, OnInit } from '@angular/core';
import {BoardSet} from '../models/boardset.model';
import {BoardSetService} from '../board-set.service';
import {Router} from '@angular/router';
import {BoardsetEditorDialogComponent} from '../boardset-editor-dialog/boardset-editor-dialog.component';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {Board} from '../models/board.model';
import {ObfUploadDialogComponent} from '../obf-upload-dialog/obf-upload-dialog.component';
import {ObzUploadDialogComponent} from '../obz-upload-dialog/obz-upload-dialog.component';

@Component({
  selector: 'app-boardset-list',
  templateUrl: './boardset-list.component.html',
  styleUrls: ['./boardset-list.component.scss']
})
export class BoardsetListComponent implements OnInit {

  boardSets: BoardSet[];

  private currentDialogRef;

  constructor(private service: BoardSetService,
              public dialog: MatDialog,
              private router: Router) { }

  ngOnInit(): void {
    this.getBoardSets();
  }

  getBoardSets(): void {
    this.service.getBoardSets().then(sets => this.boardSets = sets);
  }

  newBoardSet() {
    this.service.newBoardSet().then(bs => {
      return this.router.navigate(['boardsets', bs.uuid]);
    });
  }

  editBoardSet(boardSet: BoardSet) {
    if (this.currentDialogRef !== undefined) { return; }

    this.currentDialogRef = this.dialog.open(BoardsetEditorDialogComponent, {
      width: '300px',
      data: { boardSet }
    });

    this.currentDialogRef.afterClosed().subscribe(result => {
      // if (result instanceof BoardSet) {
      this.service.updateBoardSet(boardSet).then(r => null);
      // }

      this.currentDialogRef = undefined;
    });
  }

  deleteBoardSet(boardSet: BoardSet) {
    if (this.currentDialogRef !== undefined) { return; }

    this.currentDialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {heading: 'Delete this Board Set?', content: 'This will delete all Boards in the Board Set, and cannot be undone.'}
    });

    this.currentDialogRef.afterClosed().subscribe(result => {

      if (result) {
        this.service.delete(boardSet).then(bs => {
          this.getBoardSets();
        });
      }

      this.currentDialogRef = undefined;
    });
  }

  uploadBoardSetObz() {
    if (this.currentDialogRef !== undefined) { return; }

    this.currentDialogRef = this.dialog.open(ObzUploadDialogComponent, {
      width: '500px'
    });

    this.currentDialogRef.afterClosed().subscribe(result => {
      if (result instanceof BoardSet) {
        console.log(result);

        // Add the new Board to the BoardSet
        // this.boardSet.boards.push(result);
        // Select the new Board
        // this.selectBoard(this.boardSet.boards[this.boardSet.boards.length - 1]);
      }
      this.currentDialogRef = undefined;
    });
  }
}
