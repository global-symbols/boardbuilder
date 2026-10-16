import {AfterViewInit, Component, ElementRef, Inject, Optional, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {BoardSet} from '@data/models/boardset.model';
import {ObfObzService} from '@data/services/obf-obz.service';

@Component({
  selector: 'app-obz-upload-dialog',
  templateUrl: './obz-upload-dialog.component.html',
  styleUrls: ['./obz-upload-dialog.component.scss']
})
export class ObzUploadDialogComponent implements AfterViewInit {

  filename: string;
  fileInvalidReason: string;
  boardSet: BoardSet;

  @ViewChild('uploadInput') uploadInput: ElementRef<HTMLInputElement>;

  // Opened from "Import book": expecting a book file (a plain OBZ still imports as a board set).
  readonly expectBook: boolean;

  constructor(private obfObzService: ObfObzService,
              @Optional() @Inject(MAT_DIALOG_DATA) data: { expectBook?: boolean } | null) {
    this.expectBook = !!data?.expectBook;
  }

  get backPageName(): string {
    const type = this.boardSet?.backPage?.back_page_type;
    if (type === 'core_words') { return $localize`:core words|Back page type:Core Words`; }
    if (type === 'conversation_support') { return $localize`:conversation support|Back page type:Conversation Support`; }
    return $localize`:no back page|Shown when a book has no back page:No back page`;
  }

  ngAfterViewInit() {
    this.showFileSelector();
  }

  showFileSelector(): void {
    this.uploadInput.nativeElement.click();
  }

  fileChanged(filesList: any) {
    if (filesList.files.length !== 1) { return; }
    this.filename = filesList.files[0].name;
    this.fileInvalidReason = null;
    this.boardSet = null;

    this.obfObzService.parseObz(filesList.files[0])
      .then(boardSet => {
        this.boardSet = boardSet;
      })
      .catch(error => {
        this.boardSet = null;
        console.error('Error parsing OBZ file:', error);
        this.fileInvalidReason = error.message || 'a generic error occurred: ' + error;
      });
  }
}
