import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PdfComponent } from './pdf.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FlexModule} from '@angular/flex-layout';
import {MatIconModule} from '@angular/material/icon';


const routes: Routes = [
  { path: '', component: PdfComponent }
];

@NgModule({
  declarations: [PdfComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatToolbarModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    FlexModule,
    MatIconModule
  ]
})
export class PdfModule { }
