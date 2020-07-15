import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSliderModule} from '@angular/material/slider';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTreeModule} from '@angular/material/tree';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {DBConfig, NgxIndexedDBModule} from 'ngx-indexed-db';
import {HotkeyModule} from 'angular2-hotkeys';
import {FormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {HttpClientModule} from '@angular/common/http';
import {BoardEditorComponent} from './board-editor/board-editor.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {LocalBoardsetListComponent} from './boardset-list/local-boardset-list.component';
import {BoardsetEditorDialogComponent} from './boardset-editor-dialog/boardset-editor-dialog.component';
import {MatMenuModule} from '@angular/material/menu';
import {ObfUploadDialogComponent} from './obf-upload-dialog/obf-upload-dialog.component';
import {ObzUploadDialogComponent} from './obz-upload-dialog/obz-upload-dialog.component';
import {registerLocaleData} from '@angular/common';
import localeEnGb from '@angular/common/locales/en-GB';
import {CoreModule} from '@app/core.module';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { NavComponent } from './layout/nav/nav.component';
import {SharedModule} from '@shared/shared.module';

// Set en-GB as the default locale
registerLocaleData(localeEnGb, 'en-GB');

const dbConfig: DBConfig  = {
  name: 'BoardBuilder',
  version: 1,
  objectStoresMeta: [{
    store: 'boardsets',
    storeConfig: { keyPath: 'localId', autoIncrement: true },
    storeSchema: [
      { name: 'gs_id', keypath: 'gs_id', options: { unique: true } },
      { name: 'uuid', keypath: 'uuid', options: { unique: true } },
      { name: 'title', keypath: 'title', options: { unique: false } },
      { name: 'boards', keypath: 'title', options: { unique: false } },
    ]
  }],
};

const appRoutes: Routes = [
  // { path: 'local-boardsets',      component: LocalBoardsetListComponent },
  // { path: 'local-boardsets/:id',  component: BuilderComponent },
  // { path: 'local-boardsets/:boardset_id/:board_id/pdf', loadChildren: () => import('./pdf/pdf.module').then(m => m.PdfModule) },
  // { path: '',
  //   redirectTo: '/boardsets',
  //   pathMatch: 'full'
  // },
  {
    path: '',
    component: ContentLayoutComponent,
    // canActivate: [NoAuthGuard], // Should be replaced with actual auth guard
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('@modules/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'boardsets',
        loadChildren: () => import('@modules/board-sets/board-sets.module').then(m => m.BoardSetsModule)
      },
      {
        path: 'boardsets/:id',
        loadChildren: () => import('@modules/builder/builder.module').then(m => m.BuilderModule)
      }
    ]
  },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  declarations: [
    AppComponent,
    BoardEditorComponent,
    LocalBoardsetListComponent,
    BoardsetEditorDialogComponent,
    ObfUploadDialogComponent,
    ObzUploadDialogComponent,
    ContentLayoutComponent,
    NavComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    RouterModule,
    MatGridListModule,
    NgxIndexedDBModule.forRoot(dbConfig),
    MatCardModule,
    HotkeyModule.forRoot(),
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatRadioModule,
    FlexLayoutModule,
    MatExpansionModule,
    MatSelectModule,
    HttpClientModule,
    MatTooltipModule,
    MatTabsModule,
    MatSliderModule,
    MatTreeModule,
    MatProgressSpinnerModule,
    RouterModule.forRoot(
      appRoutes,
      {
        enableTracing: false, // <-- debugging purposes only
        preloadingStrategy: PreloadAllModules
      }
    ),
    MatMenuModule,
    CoreModule.forRoot(),
    SharedModule
  ],
  entryComponents: [
    BoardEditorComponent,
    BoardsetEditorDialogComponent,
    ObfUploadDialogComponent
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'en-GB'}
  ],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
