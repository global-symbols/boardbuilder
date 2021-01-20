import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Media} from '@data/models/media.model';
import {SymbolSearchResult} from '@data/models/symbol-search-result';

export interface AddSymbolDialogData {
  sources: Array<'symbols' | 'user_media'>;
  allowClear: boolean;
}

export const addSymbolDialogDataDefault: AddSymbolDialogData = {
  sources: ['symbols', 'user_media'],
  allowClear: false
};

@Component({
  selector: 'app-add-symbol-dialog',
  templateUrl: './add-symbol-dialog.component.html',
  styleUrls: ['./add-symbol-dialog.component.scss']
})
export class AddSymbolDialogComponent implements OnInit {

  showSymbols = true;
  showMedia = true;

  selectedTab = 0;

  constructor(
    public dialogRef: MatDialogRef<AddSymbolDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddSymbolDialogData
  ) { }

  ngOnInit(): void {
    this.showSymbols = this.data.sources.includes('symbols');
    this.showMedia = this.data.sources.includes('user_media');
    if (!this.showSymbols) { this.selectedTab = 1; }
  }

  selectMedia(media: Media): void {
    this.dialogRef.close(media);
  }

  selectSymbol(result: SymbolSearchResult): void {
    this.dialogRef.close(new Media().deserialise({public_url: result.imageUrl}));
  }

  clearImage() {
    this.dialogRef.close(new Media());
  }
}
