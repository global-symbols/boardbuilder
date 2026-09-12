import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
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
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {CopyBoardSetDialogComponent} from './components/copy-board-set-dialog/copy-board-set-dialog.component';
import {SearchPanelComponent} from './components/search-panel/search-panel.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import {SymbolCreatorAIDialogComponent} from '@shared/components/symbol-creator-ai-dialog/symbol-creator-ai-dialog.component';
import {NgxGoogleAnalyticsModule} from 'ngx-google-analytics';
import { AdaptableImageComponent } from './components/adaptable-image/adaptable-image.component';
import { ColourPickerComponent } from './components/colour-picker/colour-picker.component';
import {MatBadgeModule} from '@angular/material/badge';
import { SymbolCreatorAiComponent } from './components/symbol-creator-ai/symbol-creator-ai.component';
import { TextModeComponent } from './components/symbol-creator-ai/text-mode/text-mode.component';
import { ImageModeComponent } from './components/symbol-creator-ai/image-mode/image-mode.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HotkeyModule } from '@conflito/angular2-hotkeys';  // Fixed import
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule as MatProgressSpinnerModuleImport } from '@angular/material/progress-spinner';
import { ImageUploadDialogComponent } from './components/image-upload-dialog/image-upload-dialog.component';
import { AiImageGalleryComponent } from './components/ai-image-gallery/ai-image-gallery.component';
import { AiSelectedImageComponent } from './components/ai-selected-image/ai-selected-image.component';
import { AiControlsComponent } from './components/ai-controls/ai-controls.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ImageActionDialogComponent } from './components/image-action-dialog/image-action-dialog.component';
import { TranslateBoardSetDialogComponent } from './components/translate-board-set-dialog/translate-board-set-dialog.component';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  declarations: [
    ConfirmDialogComponent,
    ErrorNotFoundComponent,
    LoadingNoticeComponent,
    MediaLibraryComponent,
    CopyBoardSetDialogComponent,
    SearchPanelComponent,
    SymbolCreatorComponent,
    AddSymbolDialogComponent,
    BypassSanitiserPipe,
    BoardEditorFormComponent,
    StopPropagationDirective,
    BoardPreviewSvgComponent,
    SymbolCreatorDialogComponent,
    SymbolCreatorAIDialogComponent,
    AdaptableImageComponent,
    ColourPickerComponent,
    SymbolCreatorAiComponent,
    TextModeComponent,
    ImageModeComponent,
    ImageUploadDialogComponent,
    AiImageGalleryComponent,
    AiSelectedImageComponent,
    AiControlsComponent,
    ImageActionDialogComponent,
    TranslateBoardSetDialogComponent
  ],
    exports: [
        ConfirmDialogComponent,
        ErrorNotFoundComponent,
        LoadingNoticeComponent,
        MediaLibraryComponent,
        SearchPanelComponent,
        SymbolCreatorComponent,
        BypassSanitiserPipe,
        BoardEditorFormComponent,
        StopPropagationDirective,
        BoardPreviewSvgComponent,
        AdaptableImageComponent,
        ColourPickerComponent
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
        MatProgressBarModule,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatCardModule,
        MatSliderModule,
        ColorGithubModule,
        MatMenuModule,
        MatTooltipModule,
        MatTabsModule,
        NgxGoogleAnalyticsModule,
        MatBadgeModule,
        MatSlideToggleModule,
        HotkeyModule,
        MatSnackBarModule,
        MatCheckboxModule,
        MatPaginatorModule
    ]
})
export class SharedModule { }
