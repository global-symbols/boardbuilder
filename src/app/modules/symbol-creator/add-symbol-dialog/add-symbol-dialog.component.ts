import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-add-symbol-dialog',
  templateUrl: './add-symbol-dialog.component.html',
  styleUrls: ['./add-symbol-dialog.component.scss']
})
export class AddSymbolDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddSymbolDialogComponent>) { }

  ngOnInit(): void {
  }

  selectSymbol(url): void {
    this.dialogRef.close(url);
  }

}
