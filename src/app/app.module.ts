import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BuilderComponent } from './builder/builder.component';
import {
  MatButtonModule,
  MatCardModule, MatFormFieldModule,
  MatGridListModule,
  MatIconModule, MatInputModule,
  MatListModule,
  MatSidenavModule,
  MatToolbarModule
} from '@angular/material';
import {RouterModule} from '@angular/router';
import { BoardDetailComponent } from './board-detail/board-detail.component';
import {DBConfig, NgxIndexedDBModule} from 'ngx-indexed-db';
import {HotkeyModule} from 'angular2-hotkeys';
import {FormsModule} from '@angular/forms';

const dbConfig: DBConfig  = {
  name: 'BoardBuilder',
  version: 1,
  objectStoresMeta: [{
    store: 'boardsets',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      { name: 'gs_id', keypath: 'gs_id', options: { unique: true } },
      { name: 'uuid', keypath: 'uuid', options: { unique: true } },
      { name: 'title', keypath: 'title', options: { unique: false } },
      { name: 'boards', keypath: 'title', options: { unique: false } },
    ]
  }
  ],
};

@NgModule({
  declarations: [
    AppComponent,
    BuilderComponent,
    BoardDetailComponent
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
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
