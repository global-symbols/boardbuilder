import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfComponent } from './pdf/pdf.component';
import {RouterModule, Routes} from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FlexModule} from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';


export const routes: Routes = [
  {
    path: ':board_id',
    component: PdfComponent,
    pathMatch: 'full'
  },
];


@NgModule({
  declarations: [PdfComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatProgressSpinnerModule,
    FlexModule,
    MatButtonModule,
  ]
})
export class PdfModule { }
