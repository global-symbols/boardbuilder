import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BuilderComponent} from '@modules/builder/builder/builder.component';
import {CellEditorComponent} from '@modules/builder/cell-editor/cell-editor.component';
import {CellEditorSearchPanelComponent} from '@modules/builder/cell-editor-search-panel/cell-editor-search-panel.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import {FlexModule} from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {RouterModule, Routes} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {_MatMenuDirectivesModule, MatMenuModule} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDividerModule} from '@angular/material/divider';
import {BoardTreeComponent} from '@modules/builder/board-tree/board-tree.component';
import {BoardTreeItemComponent} from '@modules/builder/board-tree-item/board-tree-item.component';
import {MatListModule} from '@angular/material/list';
import {SharedModule} from '@shared/shared.module';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {BoardDetailComponent} from '@modules/builder/board-detail/board-detail.component';
import {SymbolSearchPanelComponent} from '@modules/builder/symbol-search-panel/symbol-search-panel.component';
import {MatGridListModule} from '@angular/material/grid-list';

export const routes: Routes = [
  {
    path: '',
    component: BuilderComponent,
    pathMatch: 'full'
  },
];

@NgModule({
  declarations: [
    BuilderComponent,
    CellEditorComponent,
    CellEditorSearchPanelComponent,
    BoardTreeComponent,
    BoardTreeItemComponent,
    BoardDetailComponent,
    SymbolSearchPanelComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatExpansionModule,
    MatTabsModule,
    MatIconModule,
    FlexModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatToolbarModule,
    MatTooltipModule,
    _MatMenuDirectivesModule,
    MatSidenavModule,
    MatMenuModule,
    MatDividerModule,
    MatListModule,
    SharedModule,
    MatCardModule,
    MatInputModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatGridListModule
  ]
})
export class BuilderModule { }
