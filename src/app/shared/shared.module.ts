import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ColourSelectorComponent} from './components/colour-selector/colour-selector.component';
import {ConfirmDialogComponent} from './components/confirm-dialog/confirm-dialog.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {FlexModule} from '@angular/flex-layout';
import {DragDropModule} from '@angular/cdk/drag-drop';



@NgModule({
  declarations: [
    ColourSelectorComponent,
    ConfirmDialogComponent
  ],
  exports: [
    ColourSelectorComponent,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    FlexModule,
    DragDropModule
  ]
})
export class SharedModule { }
