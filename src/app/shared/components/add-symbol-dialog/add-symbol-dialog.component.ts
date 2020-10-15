import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {Media} from '@data/models/media.model';

@Component({
  selector: 'app-add-symbol-dialog',
  templateUrl: './add-symbol-dialog.component.html',
  styleUrls: ['./add-symbol-dialog.component.scss']
})
export class AddSymbolDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddSymbolDialogComponent>) { }

  ngOnInit(): void {
  }

  selectMedia(media: Media): void {
    this.dialogRef.close(media);
  }

  selectSymbol(url): void {
    this.dialogRef.close(new Media().deserialise({public_url: url}));
  }

}
