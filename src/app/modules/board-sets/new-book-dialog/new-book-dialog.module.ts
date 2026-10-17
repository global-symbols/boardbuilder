import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {FlexModule} from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {SharedModule} from '../../../shared/shared.module';
import {NewBookDialogComponent} from './new-book-dialog.component';

// The Create Book dialog, also used by the builder for Convert to book. No routes, so any module can import it.
@NgModule({
  declarations: [NewBookDialogComponent],
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, DragDropModule, FlexModule,
    MatButtonModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatInputModule, SharedModule
  ],
  exports: [NewBookDialogComponent]
})
export class NewBookDialogModule { }
