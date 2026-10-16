import {Injectable} from '@angular/core';
import {MatDialog, MatDialogRef, MatDialogConfig} from '@angular/material/dialog';
import {Media} from '@data/models/media.model';
import {SymbolCreatorDialogComponent} from '@shared/components/symbol-creator-dialog/symbol-creator-dialog.component';
import {SymbolCreatorAIDialogComponent} from '@shared/components/symbol-creator-ai-dialog/symbol-creator-ai-dialog.component';
import {
  AddSymbolDialogComponent,
  AddSymbolDialogData,
  addSymbolDialogDataDefault
} from '@shared/components/add-symbol-dialog/add-symbol-dialog.component';
import {ConfirmDialogComponent, ConfirmDialogData} from '@shared/components/confirm-dialog/confirm-dialog.component';
import {ObzUploadDialogComponent} from '../../obz-upload-dialog/obz-upload-dialog.component';
import {BoardSet} from '@data/models/boardset.model';
import { ImageActionDialogComponent, ImageActionDialogData } from '@shared/components/image-action-dialog/image-action-dialog.component';
import { SymbolSearchResult } from '@data/models/symbol-search-result';
import { SearchResultConverterService } from '@shared/services/search-result-converter.service';

interface BasicDialogData {
  heading: string;
  content: string;
}

interface ErrorDialogData {
  heading?: string;
  content: string;
  detail?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  currentDialog: MatDialogRef<any>;

  constructor(
    private dialog: MatDialog,
    private searchResultConverter: SearchResultConverterService
  ) { }

  messageBox(data: ConfirmDialogData): MatDialogRef<ConfirmDialogComponent> {
    this.currentDialog = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data
    });
    return this.currentDialog;
  }

  openSymbolCreator(config?: MatDialogConfig): MatDialogRef<SymbolCreatorDialogComponent> {
    const defaultConfig: MatDialogConfig = {
      width: '800px',
      data: {} // Default empty data object
    };
    this.currentDialog = this.dialog.open(SymbolCreatorDialogComponent, {
      ...defaultConfig,
      ...config // Merge provided config with defaults
    });
    return this.currentDialog;
  }

  /**
   * Opens the Symbol Creator AI dialog for creating new symbols with AI
   *
   * NOTE: Consumers of this method must set parentDialogRef on the component instance
   * to enable "Send to Designer" functionality. Example:
   *
   * const dialogRef = this.dialogService.openSymbolCreatorAI();
   * dialogRef.componentInstance.parentDialogRef = dialogRef;
   *
   * @param media - Optional existing media to edit
   * @param accessPoint - Optional access point flag ('media' | 'boardset') to customize UI
   * @returns MatDialogRef for the Symbol Creator AI dialog
   */
  openSymbolCreatorAI(media?: Media, accessPoint?: 'media' | 'boardset'): MatDialogRef<SymbolCreatorAIDialogComponent> {
    this.currentDialog = this.dialog.open(SymbolCreatorAIDialogComponent, {
      width: '800px',
      data: {media, accessPoint}
    });

    return this.currentDialog;
  }

  /**
   * Opens the ImageActionDialog for users to choose what to do with a search result image
   * @param result - The search result containing image and metadata
   * @returns MatDialogRef that resolves with the chosen ImageAction or undefined if cancelled
   */
  openImageActionDialog(result: SymbolSearchResult): MatDialogRef<ImageActionDialogComponent> {
    const dialogData: ImageActionDialogData = { result };

    this.currentDialog = this.dialog.open(ImageActionDialogComponent, {
      maxWidth: '95vw',
      width: 'auto',
      data: dialogData
    });

    return this.currentDialog;
  }

  /**
   * Opens the Symbol Creator AI dialog with a pre-loaded image from a search result
   *
   * This method handles the complete workflow for loading an external image into the AI:
   * 1. Downloads the image from the provided URL
   * 2. Converts it to base64 and creates preview data
   * 3. Formats it as ImageUploadResult for the AI component
   * 4. Opens the AI dialog in image-mode with the pre-loaded image
   * 5. Automatically sets parentDialogRef to enable "Send to Designer" functionality
   *
   * DIALOG CHAINING MECHANISM:
   * - The parentDialogRef enables the "Send to Designer" workflow
   * - When user clicks "Send to Designer" in image/text mode:
   *   1. Current AI dialog closes
   *   2. SymbolCreatorDialog opens with the generated image
   *   3. User can edit the image and save as media
   *
   * @param result - The search result containing the image URL and metadata
   * @returns Promise<MatDialogRef> for the AI dialog (async due to image conversion)
   */
  async openSymbolCreatorAIWithImage(result: SymbolSearchResult): Promise<MatDialogRef<SymbolCreatorAIDialogComponent>> {
    try {
      // Convert the search result to ImageUploadResult format
      const imageUploadResult = await this.searchResultConverter.convertToImageUploadResult(result);

      // Open the AI dialog with the converted image data
      this.currentDialog = this.dialog.open(SymbolCreatorAIDialogComponent, {
        width: '800px',
        data: {
          preloadedImageData: imageUploadResult // Pass the converted image data
        }
      });

      // Set the preloaded image data on the component instance
      if (this.currentDialog.componentInstance) {
        this.currentDialog.componentInstance.preloadedImageData = imageUploadResult;

        // Set parentDialogRef to enable "Send to Designer" functionality
        // This allows image-mode and text-mode components to close this dialog
        // and open the SymbolCreatorDialog when user clicks "Send to Designer"
        // Without this, the "Send to Designer" button fails silently
        this.currentDialog.componentInstance.parentDialogRef = this.currentDialog;
      }

      return this.currentDialog;

    } catch (error) {
      console.error('[DialogService] Failed to convert image for AI dialog:', error);

      // Fallback: open regular AI dialog without pre-loaded image
      this.currentDialog = this.dialog.open(SymbolCreatorAIDialogComponent, {
        width: '800px',
        data: { error: 'Failed to load image: ' + error.message }
      });

      return this.currentDialog;
    }
  }

  openMediaLibrary(data: AddSymbolDialogData = addSymbolDialogDataDefault): MatDialogRef<AddSymbolDialogComponent> {
    this.currentDialog = this.dialog.open(AddSymbolDialogComponent, {
      width: '400px',
      data
    });

    return this.currentDialog;
  }

  error(errorData: ErrorDialogData): MatDialogRef<ConfirmDialogComponent> {
    const data: ConfirmDialogData = {
      heading: 'Something went wrong',
      ...errorData,
      icon: 'error',
      confirm: 'Continue',
    };
    this.currentDialog = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data
    });
    return this.currentDialog;
  }

  delete(deleteData: BasicDialogData): MatDialogRef<ConfirmDialogComponent> {
    const data: ConfirmDialogData = {
      ...deleteData,
      icon: 'delete',
      confirm: 'Delete',
      showCancel: true
    };
    this.currentDialog = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data
    });
    return this.currentDialog;
  }

  deleteBoardSet(boardSet: BoardSet, data: BasicDialogData): MatDialogRef<ConfirmDialogComponent> {
    if (boardSet.readonly) { return; }
    return this.delete(data);
  }

  // expectBook: opened from "Import book" (book files become books either way).
  uploadObz(expectBook = false): MatDialogRef<ObzUploadDialogComponent> {
    this.currentDialog = this.dialog.open(ObzUploadDialogComponent, {
      width: '500px',
      data: { expectBook }
    });

    return this.currentDialog;
  }
}
