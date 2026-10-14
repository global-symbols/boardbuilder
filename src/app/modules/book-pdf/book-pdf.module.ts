import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {FlexModule} from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatTooltipModule} from '@angular/material/tooltip';
import {SharedModule} from '../../shared/shared.module';
import {BookPdfComponent} from './book-pdf/book-pdf.component';

// Book printing (D31): /boardsets/:id/book-pdf prints the whole book; /boardsets/:id/book-pdf/:board_id one page.
export const routes: Routes = [
  { path: '', component: BookPdfComponent, pathMatch: 'full' },
  { path: ':board_id', component: BookPdfComponent, pathMatch: 'full' },
];

@NgModule({
  declarations: [BookPdfComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    FlexModule,
    MatButtonModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTooltipModule,
    SharedModule,
  ]
})
export class BookPdfModule { }
