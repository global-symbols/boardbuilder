import {Component, OnInit} from '@angular/core';
import {BoardSet} from '@data/models/boardset.model';
import {BoardSetService} from '@data/services/board-set.service';
import {Router} from '@angular/router';
import {BoardsetEditorDialogComponent} from '../boardset-editor-dialog/boardset-editor-dialog.component';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {ObzUploadDialogComponent} from '../obz-upload-dialog/obz-upload-dialog.component';
import {LocaleService} from '@data/services/locale.service';
import {MatSelectChange} from '@angular/material/select';

@Component({
  selector: 'app-boardset-list',
  templateUrl: './boardset-list.component.html',
  styleUrls: ['./boardset-list.component.scss']
})
export class BoardsetListComponent implements OnInit {

  boardSets: BoardSet[];
  languages: any;

  loggedIn: boolean;

  private currentDialogRef;

  constructor(private service: BoardSetService,
              public dialog: MatDialog,
              private router: Router,
              private languageService: LocaleService) { }

  ngOnInit(): void {
    this.getBoardSets();
    this.languages = this.languageService.availableLanguages();
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

    this.currentDialogRef.afterClosed().subscribe(updatedBoardSet => {
      if (updatedBoardSet instanceof BoardSet) {
        boardSet = updatedBoardSet;
        this.service.updateBoardSet(updatedBoardSet).then(r => null);
      }

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

        // Add the new BoardSet to the store, then navigate to view it.
        this.service.addBoardSet(result).then(bs => {
          return this.router.navigate(['boardsets', bs.uuid]);
        });
      }
      this.currentDialogRef = undefined;
    });
  }

  changeLanguage($event: MatSelectChange) {
    this.languageService.changeLanguage($event.value);
  }
}
