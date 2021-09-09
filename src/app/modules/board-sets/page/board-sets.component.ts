import {Component, OnDestroy, OnInit} from '@angular/core';
import {BoardSetService} from '@data/services/board-set.service';
import {BoardSet} from '@data/models/boardset.model';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {NewBoardSetDialogComponent} from '@modules/board-sets/new-board-set-dialog/new-board-set-dialog.component';
import {DialogService} from '@app/services/dialog.service';
import {ToolbarService} from '@app/services/toolbar.service';

@Component({
  selector: 'app-board-sets',
  templateUrl: './board-sets.component.html',
  styleUrls: ['./board-sets.component.scss']
})
export class BoardSetsComponent implements OnInit, OnDestroy {

  boardSets: BoardSet[];
  featuredBoardSets: BoardSet[];

  loading: boolean;
  private currentDialogRef;

  constructor(
    private service: BoardSetService,
    private router: Router,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private toolbarService: ToolbarService
  ) { }

  ngOnInit(): void {
    this.loadBoardSets();
    this.loadFeaturedBoardSets();
  }

  ngOnDestroy(): void {
    this.toolbarService.clearButtons();
  }

  loadBoardSets(): void {
    this.loading = true;
    this.service.list('preview_cells').subscribe(
        bs => this.boardSets = bs,
        error => null,
        () => this.loading = false
    );
  }

  loadFeaturedBoardSets(): void {
    this.service.featured('preview_cells').subscribe(bs => this.featuredBoardSets = bs);
  }

  newBoardSet(): void {
    if (this.currentDialogRef !== undefined) { return; }

    this.currentDialogRef = this.dialog.open(NewBoardSetDialogComponent, {
      width: '600px'
    });

    this.currentDialogRef.afterClosed().subscribe(newBoardSet => {
      if (newBoardSet instanceof BoardSet) {
        this.router.navigate(['/', 'boardsets', newBoardSet.id]);
      }

      this.currentDialogRef = undefined;
    });
  }

  uploadObz() {
    this.dialogService.uploadObz().afterClosed().subscribe(newBoardSet => {
      if (newBoardSet instanceof BoardSet) {
        // Save the newBoardSet, then open it.
        this.service.add(newBoardSet).subscribe(bs => this.openBoardSet(bs));
      }
    });
  }

  openBoardSet(boardSet: BoardSet) {
    this.router.navigate(['/', 'boardsets', boardSet.id]);
  }

  deleteBoardSet(boardSet: BoardSet) {

    this.dialogService.deleteBoardSet(boardSet, {
      heading: `Delete '${boardSet.name}'?`,
      content: `The Board Set and all its Boards will be deleted. This cannot be undone.`,
    }).afterClosed().subscribe(result => {
      if (result) {
        this.service.delete(boardSet).subscribe(r => this.loadBoardSets());
      }
    });
  }
}
