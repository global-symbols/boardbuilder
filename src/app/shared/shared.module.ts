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
import { ErrorNotFoundComponent } from './components/error-not-found/error-not-found.component';
import { LoadingNoticeComponent } from './components/loading-notice/loading-notice.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CopyBoardSetDialogComponent } from './components/copy-board-set-dialog/copy-board-set-dialog.component';



@NgModule({
  declarations: [
    ColourSelectorComponent,
    ConfirmDialogComponent,
    ErrorNotFoundComponent,
    LoadingNoticeComponent,
    CopyBoardSetDialogComponent
  ],
  exports: [
    ColourSelectorComponent,
    ConfirmDialogComponent,
    ErrorNotFoundComponent,
    LoadingNoticeComponent
  ],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    FlexModule,
    DragDropModule,
    MatProgressSpinnerModule
  ]
})
export class SharedModule { }
