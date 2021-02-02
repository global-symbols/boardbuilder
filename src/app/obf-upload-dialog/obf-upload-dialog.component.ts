import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {Board} from '@data/models/board.model';
import {Obf} from '@data/models/obf.interface';
import {BoardSet} from '@data/models/boardset.model';
import {BoardService} from '@data/services/board.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface ObfUploadDialogData {
  boardSet: BoardSet;
}

export enum ObfUploadState {
  Idle = 'Idle',
  FileInvalid = 'FileInvalid',
  Uploading = 'Uploading',
  UploadError = 'UploadError'
}

@Component({
  selector: 'app-obf-upload-dialog',
  templateUrl: './obf-upload-dialog.component.html',
  styleUrls: ['./obf-upload-dialog.component.scss']
})
export class ObfUploadDialogComponent implements OnInit {

  filename: string;
  fileInvalid: boolean;
  previewBoard: Board;
  private reader: FileReader;

  private obfBody: Obf;

  state: ObfUploadState = ObfUploadState.Idle;

  @Input() boardSet: BoardSet;

  @ViewChild('uploadInput') uploadInput: HTMLInputElement;
  constructor(
    private dialogRef: MatDialogRef<ObfUploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ObfUploadDialogData,
    private boardService: BoardService
  ) { }

  ngOnInit(): void {
    this.reader = new FileReader();

    this.reader.onload = (e) => {
      try {
        this.previewBoard = new Board();
        this.obfBody = JSON.parse(String(this.reader.result));
        this.previewBoard.fromObf(this.obfBody);
      } catch (error) {
        this.previewBoard = null;
        this.state = ObfUploadState.FileInvalid;
      }
    };
  }

  fileChanged(filesList: any) {
    this.state = ObfUploadState.Idle;
    if (filesList.files.length !== 1) { return; }
    this.filename = filesList.files[0].name;
    this.reader.readAsText(filesList.files[0]);
  }

  uploadBoard() {
    this.state = ObfUploadState.Uploading;
    this.boardService.addFromObf(this.obfBody, this.data.boardSet).subscribe(board => {
        this.dialogRef.close(board);
      },
      err => {
        this.state = ObfUploadState.UploadError;
        console.log(err);
      }
    );
  }
}
