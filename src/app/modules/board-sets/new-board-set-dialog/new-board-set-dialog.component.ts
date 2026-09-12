import {Component, OnInit, ViewChild} from '@angular/core';
import {BoardSet} from '@data/models/boardset.model';
import {BoardSetService} from '@data/services/board-set.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Board} from '@data/models/board.model';
import {MatDialogRef} from '@angular/material/dialog';
import {StepperSelectionEvent} from '@angular/cdk/stepper';
import {BoardEditorFormComponent} from '@shared/components/board-editor-form/board-editor-form.component';


@Component({
  selector: 'app-new-board-set-dialog',
  templateUrl: './new-board-set-dialog.component.html',
  styleUrls: ['./new-board-set-dialog.component.scss']
})
export class NewBoardSetDialogComponent implements OnInit {

  name = new FormControl('');

  boardSetForm: FormGroup;

  board: Board;
  catalogueTabs = false;

  @ViewChild(BoardEditorFormComponent) boardEditorForm: BoardEditorFormComponent;

  constructor(
    public dialogRef: MatDialogRef<NewBoardSetDialogComponent>,
    private service: BoardSetService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.boardSetForm = this.formBuilder.group({
      name: ['', Validators.required]
    });

    this.board = new Board({
      name: 'Board 1',
      rows: 3,
      columns: 4,
      captions_position: 'below'
    });
  }

  create(): void {
    this.board.tab_enabled = this.catalogueTabs;
    const boardSet = new BoardSet({
      name: this.boardSetForm.value.name,
      catalogue_tabs: this.catalogueTabs,
      boards: [this.board]
    });

    this.service.add(boardSet).subscribe(bs => this.dialogRef.close(bs));
  }

  stepperStepChanged($event: StepperSelectionEvent) {
    if ($event.selectedIndex === 1) {
      this.boardEditorForm.focusTitleField();
    }
  }
}
