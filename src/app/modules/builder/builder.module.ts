import {NewBookDialogModule} from '@modules/board-sets/new-book-dialog/new-book-dialog.module';
import {PrintPageDialogComponent} from './print-page-dialog/print-page-dialog.component';
import {BookPageListComponent} from './book-page-list/book-page-list.component';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BuilderComponent} from '@modules/builder/builder/builder.component';
import {CellEditorComponent} from '@modules/builder/cell-editor/cell-editor.component';
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
import {MatListModule} from '@angular/material/list';
import {SharedModule} from '@shared/shared.module';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {BoardDetailComponent} from '@modules/builder/board-detail/board-detail.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {BoardEditorDialogComponent} from './board-editor-dialog/board-editor-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatSliderModule} from '@angular/material/slider';
import {BoardSetEditorDialogComponent} from './board-set-editor-dialog/board-set-editor-dialog.component';
import {MatTreeModule} from '@angular/material/tree';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {ColorGithubModule} from 'ngx-color/github';
import {NgxGoogleAnalyticsModule} from 'ngx-google-analytics';
import {HotkeyModule} from '@conflito/angular2-hotkeys';
import { MaterialExtensionsModule, MaterialExtensionsExperimentalModule } from '@ng-matero/extensions';
import { MtxSelectModule } from '@ng-matero/extensions/select';
import { CellEditorColourPanelComponent } from './cell-editor-colour-panel/cell-editor-colour-panel.component';
import { EnableTabsDialogComponent, FreeDragDirective } from './enable-tabs-dialog/enable-tabs-dialog.component';
import { PrintableBookDialogComponent } from './printable-book-dialog/printable-book-dialog.component';
import { TranslateBoardDialogComponent } from './translate-board-dialog/translate-board-dialog.component';
import { MatRadioModule } from '@angular/material/radio';

export const routes: Routes = [
  {
    path: '',
    component: BuilderComponent,
    pathMatch: 'full'
  },
  {
    path: 'pdf',
    loadChildren: () => import('@modules/pdf/pdf.module').then(m => m.PdfModule)
  },
  {
    // Books print here, never on the board-set PDF screen (D31).
    path: 'book-pdf',
    loadChildren: () => import('@modules/book-pdf/book-pdf.module').then(m => m.BookPdfModule)
  }
];

@NgModule({
    declarations: [
    PrintPageDialogComponent,
    BookPageListComponent,
        BuilderComponent,
        CellEditorComponent,
        BoardTreeComponent,
        BoardDetailComponent,
        BoardEditorDialogComponent,
        BoardSetEditorDialogComponent,
        CellEditorColourPanelComponent,
        EnableTabsDialogComponent,
        FreeDragDirective,
        PrintableBookDialogComponent,
        TranslateBoardDialogComponent
    ],
    imports:      [
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
        ReactiveFormsModule,
        MaterialExtensionsModule,
        MaterialExtensionsExperimentalModule,
        MtxSelectModule,
        MatProgressSpinnerModule,
        MatGridListModule,
        MatDialogModule,
        MatSnackBarModule,
        DragDropModule,
        MatSliderModule,
        MatTreeModule,
        MatSlideToggleModule,
        MatCheckboxModule,
        MatRadioModule,
        NewBookDialogModule,
        HotkeyModule,
        ColorGithubModule,
        NgxGoogleAnalyticsModule
    ]
})
export class BuilderModule { }
