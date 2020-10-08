import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SymbolCreatorComponent } from './symbol-creator/symbol-creator.component';
import {RouterModule, Routes} from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {SharedModule} from '../../shared/shared.module';
import {FlexModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTooltipModule} from '@angular/material/tooltip';


const routes: Routes = [
  {
    path: '',
    component: SymbolCreatorComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [SymbolCreatorComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MatCardModule,
        SharedModule,
        FlexModule,
        FormsModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatIconModule,
        MatExpansionModule,
        MatTooltipModule,
    ]
})
export class SymbolCreatorModule { }
