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
import { SearchPanelComponent } from './components/search-panel/search-panel.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';



@NgModule({
  declarations: [
    ColourSelectorComponent,
    ConfirmDialogComponent,
    ErrorNotFoundComponent,
    LoadingNoticeComponent,
    CopyBoardSetDialogComponent,
    SearchPanelComponent,
    SearchPanelComponent
  ],
  exports: [
    ColourSelectorComponent,
    ConfirmDialogComponent,
    ErrorNotFoundComponent,
    LoadingNoticeComponent,
    SearchPanelComponent
  ],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    FlexModule,
    DragDropModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    MatCardModule
  ]
})
export class SharedModule { }
