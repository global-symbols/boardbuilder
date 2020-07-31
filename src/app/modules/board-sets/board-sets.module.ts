import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {BoardSetsComponent} from '@modules/board-sets/page/board-sets.component';
import {FlexModule} from '@angular/flex-layout';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MomentModule} from 'ngx-moment';
import { NewBoardSetDialogComponent } from './new-board-set-dialog/new-board-set-dialog.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSliderModule} from '@angular/material/slider';
import {SharedModule} from '../../shared/shared.module';

export const routes: Routes = [
  {
    path: '',
    component: BoardSetsComponent,
    pathMatch: 'full'
  },
];

@NgModule({
  declarations: [
    BoardSetsComponent,
    NewBoardSetDialogComponent,
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FlexModule,
        MatIconModule,
        MatTooltipModule,
        MatButtonModule,
        MatCardModule,
        MatGridListModule,
        MomentModule,
        DragDropModule,
        MatDialogModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatSliderModule,
        SharedModule
    ]
})
export class BoardSetsModule { }
