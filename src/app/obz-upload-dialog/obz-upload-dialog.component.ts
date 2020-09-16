import { Component, OnInit } from '@angular/core';
import {BoardSet} from '@data/models/boardset.model';
import {ObfObzService} from '@data/services/obf-obz.service';

@Component({
  selector: 'app-obz-upload-dialog',
  templateUrl: './obz-upload-dialog.component.html',
  styleUrls: ['./obz-upload-dialog.component.scss']
})
export class ObzUploadDialogComponent implements OnInit {

  filename: string;
  fileInvalidReason: string;
  boardSet: BoardSet;

  constructor(private obfObzService: ObfObzService) { }

  ngOnInit(): void { }

  fileChanged(filesList: any) {
    if (filesList.files.length !== 1) { return; }
    this.filename = filesList.files[0].name;
    this.fileInvalidReason = null;

    try {
      this.boardSet = this.obfObzService.parseObz(filesList.files[0]);
    } catch (error) {
      this.boardSet = null;
      this.fileInvalidReason = 'a generic error occurred: ' + error;
    }
  }
}
