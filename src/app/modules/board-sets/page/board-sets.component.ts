import { Component, OnInit } from '@angular/core';
import {BoardSetService} from '@data/services/board-set.service';
import {Observable} from 'rxjs';
import {BoardSet} from '@data/models/boardset.model';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {NewBoardSetDialogComponent} from '@modules/board-sets/new-board-set-dialog/new-board-set-dialog.component';
import {Board} from '@data/models/board.model';
import {ObfUploadDialogComponent} from '../../../obf-upload-dialog/obf-upload-dialog.component';
import {ObzUploadDialogComponent} from '../../../obz-upload-dialog/obz-upload-dialog.component';

@Component({
  selector: 'app-board-sets',
  templateUrl: './board-sets.component.html',
  styleUrls: ['./board-sets.component.scss']
})
export class BoardSetsComponent implements OnInit {

  boardSets: Observable<BoardSet[]>;
  private currentDialogRef;

  constructor(
    private service: BoardSetService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadBoardSets();
  }

  loadBoardSets(): void {
    this.boardSets = this.service.list();
  }

  newBoardSet(): void {
    if (this.currentDialogRef !== undefined) { return; }

    this.currentDialogRef = this.dialog.open(NewBoardSetDialogComponent, {
      width: '400px'
    });

    this.currentDialogRef.afterClosed().subscribe(newBoardSet => {
      if (newBoardSet instanceof BoardSet) {
        this.router.navigate(['/', 'boardsets', newBoardSet.id]);
      }

      this.currentDialogRef = undefined;
    });
  }

  uploadObz() {
    if (this.currentDialogRef !== undefined) { return; }

    this.currentDialogRef = this.dialog.open(ObzUploadDialogComponent, {
      width: '500px'
    });

    this.currentDialogRef.afterClosed().subscribe(newBoardSet => {
      if (newBoardSet instanceof BoardSet) {

        // Save the newBoardSet, then reload the BoardSet.
        this.service.add(newBoardSet).subscribe(bs => {
          this.router.navigate(['/', 'boardsets', bs.id]);
        });
      }
      this.currentDialogRef = undefined;
    });
  }
}
