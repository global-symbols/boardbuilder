import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FlexModule} from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {PdfPreviewComponent} from './pdf-preview/pdf-preview.component';
import {FormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {SharedModule} from '../../shared/shared.module';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatExpansionModule} from '@angular/material/expansion';


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
    FormsModule,
    MatSelectModule,
    MatCardModule,
    SharedModule,
    MatIconModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatExpansionModule,
  ]
})
export class PdfModule { }
