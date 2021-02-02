import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ColourSelectorComponent} from './components/colour-selector/colour-selector.component';
import {ConfirmDialogComponent} from './components/confirm-dialog/confirm-dialog.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {FlexModule} from '@angular/flex-layout';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {ErrorNotFoundComponent} from './components/error-not-found/error-not-found.component';
import {LoadingNoticeComponent} from './components/loading-notice/loading-notice.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {CopyBoardSetDialogComponent} from './components/copy-board-set-dialog/copy-board-set-dialog.component';
import {SearchPanelComponent} from './components/search-panel/search-panel.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MediaLibraryComponent} from '@shared/components/media-library/media-library.component';
import {SymbolCreatorComponent} from '@shared/components/symbol-creator/symbol-creator.component';
import {MatSliderModule} from '@angular/material/slider';
import {ColorGithubModule} from 'ngx-color/github';
import {MatMenuModule} from '@angular/material/menu';
import {MatTooltipModule} from '@angular/material/tooltip';
import {AddSymbolDialogComponent} from '@shared/components/add-symbol-dialog/add-symbol-dialog.component';
import {MatTabsModule} from '@angular/material/tabs';
import {BypassSanitiserPipe} from './pipes/bypass-sanitiser.pipe';
import {BoardEditorFormComponent} from './components/board-editor-form/board-editor-form.component';
import {StopPropagationDirective} from './directives/stop-propagation.directive';
import {BoardPreviewSvgComponent} from './components/board-preview-svg/board-preview-svg.component';
import {SymbolCreatorDialogComponent} from '@shared/components/symbol-creator-dialog/symbol-creator-dialog.component';
import {NgxGoogleAnalyticsModule} from 'ngx-google-analytics';


@NgModule({
  declarations: [
    ColourSelectorComponent,
    ConfirmDialogComponent,
    ErrorNotFoundComponent,
    LoadingNoticeComponent,
    MediaLibraryComponent,
    CopyBoardSetDialogComponent,
    SearchPanelComponent,
    SearchPanelComponent,
    SymbolCreatorComponent,
    AddSymbolDialogComponent,
    BypassSanitiserPipe,
    BoardEditorFormComponent,
    StopPropagationDirective,
    BoardPreviewSvgComponent,
    SymbolCreatorDialogComponent
  ],
  exports: [
    ColourSelectorComponent,
    ConfirmDialogComponent,
    ErrorNotFoundComponent,
    LoadingNoticeComponent,
    MediaLibraryComponent,
    SearchPanelComponent,
    SymbolCreatorComponent,
    BypassSanitiserPipe,
    BoardEditorFormComponent,
    StopPropagationDirective,
    BoardPreviewSvgComponent
  ],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    FlexModule,
    DragDropModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
    MatSliderModule,
    ColorGithubModule,
    MatMenuModule,
    MatTooltipModule,
    MatTabsModule,
    NgxGoogleAnalyticsModule
  ]
})
export class SharedModule { }
