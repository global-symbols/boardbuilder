import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { AnimationEvent } from '@angular/animations';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ImageUploadResult } from '../../image-upload-dialog/image-upload-dialog.component';
import { AiSymbolHttpService } from '@data/services/ai-symbol-http.service';
import { AiSymbolStateService, StyleConfig } from '@data/services/ai-symbol-state.service';
import { BaseAiSymbolGeneratorComponent } from '../base-ai-symbol-generator.component';
import { AiImageToImageParams, PromptOptions } from '@data/models/ai-symbol.interfaces';
import { MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { HotkeysService } from '@conflito/angular2-hotkeys';
import { DialogService } from '@app/services/dialog.service';
import { SymbolCreatorDialogData } from '@shared/components/symbol-creator-dialog/symbol-creator-dialog.component';
import { PromptBuilderService } from '@shared/services/prompt-builder.service';
import { ScaiAnalyticsService } from '@shared/services/scai-analytics.service';
import { ErrorMessageService } from '@shared/services/error-message.service';
import { interval, Subscription } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-image-mode',
  templateUrl: './image-mode.component.html',
  styleUrls: ['./image-mode.component.scss']
})
export class ImageModeComponent extends BaseAiSymbolGeneratorComponent implements OnInit, OnDestroy {
  @Input() uploadedImageData: ImageUploadResult | null = null;
  @Input() parentDialogRef?: MatDialogRef<any>;

  // Component-specific state only
  outlinesEnabled: boolean = true;

  protected outlineWidth: number = 7;
  protected saturation: string = 'bold';

  // Queue polling subscription
  private queuePollSubscription?: Subscription;

  constructor(
    aiSymbolHttpService: AiSymbolHttpService,
    stateService: AiSymbolStateService,
    hotkeysService: HotkeysService,
    private sanitizer: DomSanitizer,
    private dialogService: DialogService,
    private promptBuilder: PromptBuilderService,
    analytics: ScaiAnalyticsService,
    errorMessageService: ErrorMessageService
  ) {
    super(aiSymbolHttpService, stateService, hotkeysService, analytics, errorMessageService);
  }

  ngOnInit() {
    // Component ready - user can upload image and configure settings
  }

  // Image upload handling
  onImageUploaded(result: ImageUploadResult) {
    this.uploadedImageData = result;

    // Clear any previous generation results
    this.clearPreviousResults();
  }

  clearUploadedImage() {
    this.uploadedImageData = null;
    this.clearPreviousResults();
  }

  private clearPreviousResults() {
    this.stateService.clearGalleryState();
    this.stateService.clearApiError();
  }

  // Override generateImages from base class
  generateImages() {
    this.generateImageVariations();
  }

  // Generate image variations using AiSymbolHttpService
  generateImageVariations() {
    // Guard against concurrent generations
    if (this.stateService.currentGalleryState.isLoading) {
      return;
    }
    if (!this.uploadedImageData) {
      console.warn('[ImageModeComponent] No uploaded image data available');
      return;
    }

    const generationId = Date.now().toString(36);

    // Clear any previous errors and update state
    this.stateService.clearApiError();
    // Detect if we are refreshing existing images vs. first load
    const hadImages = this.stateService.currentGalleryState.generatedImages.some(img => !!img);
    this.stateService.setLoading(true);
    // Keep placeholders visible while loading to mimic initial request behavior
    this.stateService.setRefreshing(false);
    this.stateService.clearSelection();
    // Do not hide images-row on refresh; leave showImages as-is so placeholders stay visible

    // Set empty images initially
    this.stateService.setGeneratedImages(Array(4).fill(''));

    // Build prompt using service and current style state
    const styleState = this.stateService.currentStyleState;
    const styleConfig = this.stateService.getStyleConfiguration(styleState.selectedStyle);

    const promptOptions: PromptOptions = {
      mode: 'image',
      userPrompt: '',
      styleState,
      styleConfig: styleConfig || undefined
    };

    this.fullPrompt = this.promptBuilder.buildPrompt(promptOptions);
    // Log prompt (image mode: uploaded image provided)
    const sessionId = this.analytics?.currentSessionId || 0;
    if (sessionId) {
      const styleState = this.stateService.currentStyleState;
      this.analytics?.createPrompt({
        session_id: sessionId,
        user_input: '',
        full_prompt: this.fullPrompt,
        style: styleState.selectedStyle,
        culture: styleState.cultureText || undefined
      }).subscribe();
    }

    // Build parameters for image-to-image generation
    const params: AiImageToImageParams = {
      image: this.uploadedImageData.base64,
      prompt: this.fullPrompt, // Use the built prompt
      num_images: 4,
      steps: 4,
      loraAdapter: styleConfig?.loraAdapter,
      loraStrength: styleConfig?.loraStrength
    };

    // Call the service to generate image variations
    this.aiSymbolHttpService.generateImageVariations(params)
      .subscribe({
        next: (response) => {
          // Handle queue response - only show queue info when GPU is busy (queue_position > 0)
          if (response.status === 'queued' && response.job_id && response.queue_position !== undefined && response.queue_position > 0) {
            // Set queue info in state
            this.stateService.setQueueInfo(
              response.queue_position,
              response.estimated_wait_time || 0,
              response.job_id
            );
            
            // Start polling for job completion
            this.startPollingJobStatus(response.job_id);
            return;
          }
          
          // If queued but queue_position is 0 (shouldn't happen, but handle gracefully)
          if (response.status === 'queued' && response.job_id) {
            // Start polling but don't show queue info
            this.startPollingJobStatus(response.job_id);
            return;
          }
          
          // Handle completed response or legacy response (direct image_urls)
          if (response.image_urls && response.image_urls.length > 0) {
            this.stateService.setGeneratedImages(response.image_urls);
            // Log generated images with prompt id
            const promptId = this.analytics?.lastPromptId || 0;
            const sessionId = this.analytics?.currentSessionId || 0;
            if (promptId && sessionId) {
              response.image_urls.forEach((url, idx) => {
                this.analytics?.createGeneratedImage({
                  prompt_id: promptId,
                  image_url: url,
                  position: idx + 1,
                  session_id: sessionId
                }).subscribe();
              });
            }
            this.stateService.setLoading(false);
            this.stateService.setRefreshing(false);
          }
        },
        error: (error) => {
          console.error(`[ImageModeComponent] ✗ Generation failed [${generationId}]:`, error);
          this.handleApiError(error);
        }
      });
  }

  // Component-specific event handlers
  onExpandDone(event: AnimationEvent) {
    if (event.phaseName === 'done' && event.fromState === 'void') {
      this.stateService.setShowImages(true);
    }
  }

  // Override filename generation for image variations
  protected generateDownloadFilename(style: string): string {
    return this.aiSymbolHttpService.generateFilename(this.fullPrompt, style);
  }

  importToDesigner() {
    const galleryState = this.stateService.currentGalleryState;
    const styleState = this.stateService.currentStyleState;

    if (galleryState.selectedImageIndex === null || !galleryState.generatedImages[galleryState.selectedImageIndex]) {
      console.warn('[ImageModeComponent] No image selected for import to designer');
      return;
    }

    const imageUrl = galleryState.generatedImages[galleryState.selectedImageIndex];
    const mappedId = this.analytics?.getImageIdForUrl(imageUrl);
    const imageId = mappedId ?? (galleryState.selectedImageIndex + 1);
    if (imageId) {
      this.analytics?.createAction({ image_id: imageId, action_type: 'send to designer' }).subscribe();
    }
    const filename = this.aiSymbolHttpService.generateFilename(this.fullPrompt, styleState.selectedStyle);

    this.aiSymbolHttpService.downloadImage(imageUrl, filename).subscribe(
      (blob) => {
        if (!blob) {
          console.error('Failed to fetch image blob for editing');
          return;
        }

        if (this.parentDialogRef) {
          this.parentDialogRef.afterClosed().subscribe(() => {
            const dialogConfig: MatDialogConfig = {
              width: '800px',
              data: { blob } as SymbolCreatorDialogData,
            };
            const dialogRef = this.dialogService.openSymbolCreator(dialogConfig);
            dialogRef.afterClosed().subscribe((mediaItem) => {
              if (mediaItem) {
                // Symbol Creator dialog closed with media
              }
            });
          });
          this.parentDialogRef.close();
        }
      },
      (error) => {
        console.error('Error fetching image for editing:', error);
      }
    );
  }

  get originalImageUrl(): SafeUrl | string {
    if (this.uploadedImageData?.preview) {
      // Sanitize blob URLs to make them safe for Angular
      return this.sanitizer.bypassSecurityTrustUrl(this.uploadedImageData.preview);
    }
    return '';
  }

  onRemoveBackground(): void {
    super.onRemoveBackground();
  }

  onExamplesClicked(): void {
    if (this.parentDialogRef) {
      // Access the dialog component and open the examples modal
      const dialogComponent = this.parentDialogRef.componentInstance;
      if (dialogComponent && typeof dialogComponent.openExamplesModal === 'function') {
        dialogComponent.openExamplesModal();
      }
    }
  }

  private startPollingJobStatus(jobId: string): void {
    // Stop any existing polling
    if (this.queuePollSubscription) {
      this.queuePollSubscription.unsubscribe();
    }

    const maxPolls = 60; // ~3 minutes at 3s intervals
    let pollCount = 0;

    this.queuePollSubscription = interval(3000) // Poll every 3 seconds
      .pipe(
        switchMap(() => {
          pollCount++;
          return this.aiSymbolHttpService.pollJobStatus(jobId);
        }),
        takeWhile((response) => {
          // Continue polling while status is 'queued' or 'processing'
          return response.status === 'queued' || response.status === 'processing';
        }, true) // inclusive: emit the last value that fails the condition
      )
      .subscribe({
        next: (response) => {
          if (response.status === 'queued' && response.queue_position !== undefined && response.queue_position > 0) {
            // Update queue info only when GPU is busy (queue_position > 0)
            this.stateService.setQueueInfo(
              response.queue_position,
              response.estimated_wait_time || 0,
              jobId
            );
          } else if (response.status === 'processing' || (response.status === 'queued' && response.queue_position === 0)) {
            // Clear queue info when processing starts
            this.stateService.clearQueueInfo();
          } else if (response.status === 'completed' && response.image_urls && response.image_urls.length > 0) {
            // Job completed, set images
            this.stateService.setGeneratedImages(response.image_urls);
            this.stateService.clearQueueInfo();

            // Log generated images with prompt id
            const promptId = this.analytics?.lastPromptId || 0;
            const sessionId = this.analytics?.currentSessionId || 0;
            if (promptId && sessionId) {
              response.image_urls.forEach((url, idx) => {
                this.analytics?.createGeneratedImage({
                  prompt_id: promptId,
                  image_url: url,
                  position: idx + 1,
                  session_id: sessionId
                }).subscribe();
              });
            }

            this.stateService.setLoading(false);
            this.stateService.setRefreshing(false);

            // Stop polling
            if (this.queuePollSubscription) {
              this.queuePollSubscription.unsubscribe();
              this.queuePollSubscription = undefined;
            }
          }

          // Check max polls
          if (pollCount >= maxPolls) {
            this.handleApiError({ status: 504, error: { detail: 'Request timed out waiting for result' } });
            if (this.queuePollSubscription) {
              this.queuePollSubscription.unsubscribe();
              this.queuePollSubscription = undefined;
            }
          }
        },
        error: (error) => {
          this.handleApiError(error);
          if (this.queuePollSubscription) {
            this.queuePollSubscription.unsubscribe();
            this.queuePollSubscription = undefined;
          }
        }
      });
  }

  ngOnDestroy() {
    if (this.queuePollSubscription) {
      this.queuePollSubscription.unsubscribe();
    }
    super.ngOnDestroy();
  }
}
