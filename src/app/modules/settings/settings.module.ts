import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageComponent } from './page/page.component';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import {ColorGithubModule} from 'ngx-color/github';
import {MatButtonModule} from '@angular/material/button';
import {FlexModule} from '@angular/flex-layout';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatIconModule} from '@angular/material/icon';
import {MomentModule} from 'ngx-moment';


const routes: Routes = [
  {
    path: '',
    component: PageComponent,
    pathMatch: 'full'
  }
];



@NgModule({
  declarations: [
    PageComponent
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        SharedModule,
        ColorGithubModule,
        MatButtonModule,
        FlexModule,
        MatTooltipModule,
        MatIconModule,
        MomentModule,
    ]
})
export class SettingsModule { }
