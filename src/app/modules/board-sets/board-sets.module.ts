import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {BoardSetsComponent} from '@modules/board-sets/page/board-sets.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {FlexModule} from '@angular/flex-layout';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';

export const routes: Routes = [
  {
    path: '',
    component: BoardSetsComponent,
    pathMatch: 'full'
  },
];

@NgModule({
  declarations: [BoardSetsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatGridListModule,
    FlexModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule
  ]
})
export class BoardSetsModule { }
