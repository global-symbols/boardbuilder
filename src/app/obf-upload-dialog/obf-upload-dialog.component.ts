import {Component, OnInit, ViewChild} from '@angular/core';
import {Board} from '@data/models/board.model';

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

  @ViewChild('uploadInput') uploadInput: HTMLInputElement;
  constructor() { }

  ngOnInit(): void {
    this.reader = new FileReader();
    this.fileInvalid = false;

    this.reader.onload = (e) => {
      try {
        const obfBody = JSON.parse(String(this.reader.result));
        this.previewBoard = new Board();
        this.previewBoard.fromObf(obfBody);
      } catch (error) {
        this.previewBoard = null;
        this.fileInvalid = true;
      }
    };
  }

  fileChanged(filesList: any) {
    if (filesList.files.length !== 1) { return; }
    this.filename = filesList.files[0].name;
    this.reader.readAsText(filesList.files[0]);
  }
}
