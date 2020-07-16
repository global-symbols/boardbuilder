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
    MomentModule
  ]
})
export class BoardSetsModule { }
