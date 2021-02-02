import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MediaComponent} from './page/media.component';
import {SharedModule} from '../../shared/shared.module';
import {RouterModule, Routes} from '@angular/router';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {FlexModule} from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {NgxFilesizeModule} from 'ngx-filesize';
import {MatTooltipModule} from '@angular/material/tooltip';
import {NgxGoogleAnalyticsModule} from 'ngx-google-analytics';


export const routes: Routes = [
  {
    path: '',
    component: MediaComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [MediaComponent],
    imports: [
        NgxFilesizeModule,
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes),
        MatMenuModule,
        MatIconModule,
        FlexModule,
        MatButtonModule,
        MatCardModule,
        MatTooltipModule,
        NgxGoogleAnalyticsModule,
    ]
})
export class MediaModule { }
