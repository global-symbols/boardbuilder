import {Component, OnInit, ViewChild} from '@angular/core';
import {Board} from '../models/board.model';

@Component({
  selector: 'app-obf-upload-dialog',
  templateUrl: './obf-upload-dialog.component.html',
  styleUrls: ['./obf-upload-dialog.component.css']
})
export class ObfUploadDialogComponent implements OnInit {

  filename: string;
  previewBoard: Board;
  private reader: FileReader;

  @ViewChild('uploadInput') uploadInput: HTMLInputElement;
  constructor() { }

  ngOnInit(): void {
    this.reader = new FileReader();

    this.reader.onload = (e) => {
      this.previewBoard = new Board();
      console.log(this.reader.result);
      const obfBody = JSON.parse(String(this.reader.result));
      console.log(obfBody);
      this.previewBoard.fromObf(obfBody);
      console.log(this.previewBoard);
    };
  }

  fileChanged(filesList: any) {
    // console.log(typeof filesList.files, filesList.files, filesList.files[0], filesList.files.length);

    if (filesList.files.length !== 1) { return; }

    this.filename = filesList.files[0].name;
    this.reader.readAsText(filesList.files[0]);
  }


}
