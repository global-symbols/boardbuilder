import { Component, OnInit } from '@angular/core';
import {BoardSetService} from '@data/services/board-set.service';
import {Observable} from 'rxjs';
import {BoardSet} from '@data/models/boardset.model';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {NewBoardSetDialogComponent} from '@modules/board-sets/new-board-set-dialog/new-board-set-dialog.component';

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
      width: '400px',
      // data: { boardSet: this.boardSet }
    });

    this.currentDialogRef.afterClosed().subscribe(newBoardSet => {
      console.log(newBoardSet);
      if (newBoardSet instanceof BoardSet) {
        this.router.navigate(['/', 'boardsets', newBoardSet.id]);
      }

      this.currentDialogRef = undefined;
    });
    // this.service.add(new BoardSet()).subscribe(bs => this.router.navigate(['/', bs.id]));
  }

}
