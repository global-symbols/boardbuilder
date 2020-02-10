import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BuilderComponent } from './builder/builder.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import {RouterModule} from '@angular/router';
import { BoardDetailComponent } from './board-detail/board-detail.component';
import {DBConfig, NgxIndexedDBModule} from 'ngx-indexed-db';
import {HotkeyModule} from 'angular2-hotkeys';
import {FormsModule} from '@angular/forms';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { SymbolSearchDialogComponent } from './symbol-search-dialog/symbol-search-dialog.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { ColourSelectorComponent } from './colour-selector/colour-selector.component';
import { CellEditorComponent } from './cell-editor/cell-editor.component';
import {HttpClientModule} from '@angular/common/http';
import { BoardEditorComponent } from './board-editor/board-editor.component';
import { SymbolSearchPanelComponent } from './symbol-search-panel/symbol-search-panel.component';
import { BoardTreeComponent } from './board-tree/board-tree.component';
import { BoardTreeItemComponent } from './board-tree-item/board-tree-item.component';

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
    BoardDetailComponent,
    ConfirmDialogComponent,
    SymbolSearchDialogComponent,
    ColourSelectorComponent,
    CellEditorComponent,
    BoardEditorComponent,
    SymbolSearchPanelComponent,
    BoardTreeComponent,
    BoardTreeItemComponent
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
    MatTreeModule
  ],
  entryComponents: [
    ConfirmDialogComponent,
    SymbolSearchDialogComponent,
    BoardEditorComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
