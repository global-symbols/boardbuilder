import { Component, OnInit } from '@angular/core';
import {Board} from '../models/board.model';
import * as JSZip from 'jszip';
import {BoardSet} from '../models/boardset.model';

@Component({
  selector: 'app-obz-upload-dialog',
  templateUrl: './obz-upload-dialog.component.html',
  styleUrls: ['./obz-upload-dialog.component.css']
})
export class ObzUploadDialogComponent implements OnInit {

  filename: string;
  fileInvalidReason: string;
  boardSet: BoardSet;

  constructor() { }

  ngOnInit(): void { }

  fileChanged(filesList: any) {
    if (filesList.files.length !== 1) { return; }
    this.filename = filesList.files[0].name;
    this.fileInvalidReason = null;

    try {
      // Try to open the zip file
      JSZip.loadAsync(filesList.files[0]).then(zip => {

        // Check the manifest file exists
        if (!zip.file('manifest.json')) {
          return this.fileInvalidReason = 'it does not contain a manifest.json file.';
        }

        // Try to open the manifest file
        zip.file('manifest.json').async('string').then(manifest => {

          manifest = JSON.parse(manifest);

          // Create a new BoardSet using the OBZ filename as the title
          this.boardSet = new BoardSet({title: this.filename});
          this.boardSet.boards = [];

          // From the manifest, get the path of each OBF file.
          // The list of OBF files is stored as an object {}, so we have to use Object.entries
          Object.entries(manifest.paths.boards).forEach((board) => {

            // The key is the ID of the OBF, used for referencing when linking Boards.
            const obfId = board[0];
            // The value is the OBF path and filename within the zip file.
            const obfFilename = board[1];

            // Check the OBF file exists within the zip.
            if (!zip.file(obfFilename)) {
              return this.fileInvalidReason = obfFilename + ' is missing.';
            }

            // Access the OBF file, unpack it to a Board and save it into the BoardSet.
            zip.file(obfFilename).async('string').then(obf => {
              // Prepare a new Board, build it from the OBF and push it to the BoardSet.
              const b = new Board();
              b.fromObf(JSON.parse(obf));
              this.boardSet.boards.push(b);
            });
          });

        }, error => this.fileInvalidReason = 'the manifest.json file could not be read.');

      }, error => this.fileInvalidReason = 'it is corrupted (could not read ZIP).');

    } catch (error) {
      this.boardSet = null;
      this.fileInvalidReason = 'a generic error occurred: ' + error;
    }
  }
}
