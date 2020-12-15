import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FlexModule} from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import { PdfPreviewComponent } from './pdf-preview/pdf-preview.component';


export const routes: Routes = [
  {
    path: ':board_id',
    component: PdfPreviewComponent,
    pathMatch: 'full'
  },
];

@NgModule({
  declarations: [PdfPreviewComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatProgressSpinnerModule,
    FlexModule,
    MatButtonModule,
  ]
})
export class PdfModule { }
