import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, combineLatest, forkJoin } from 'rxjs';
import { map, tap } from 'rxjs/operators';

// Style configuration interface
export interface StyleConfig {
  culture?: {
    enabled: boolean;
    defaultValue: string;
  };
  loraAdapter?: string;
  loraTrigger?: string;
  loraStrength?: number;
  prompt?: string;
}

// Gallery state interface
export interface GalleryState {
  generatedImages: string[];
  originalImages: string[]; // Original URLs for undo functionality
  selectedImageIndex: number | null;
  isGenerated: boolean;
  showImages: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  progressBars: number[]; // Progress values for each image (0-100)
  queuePosition: number | null;
  estimatedWaitTime: number | null; // seconds
  jobId: string | null;
}

// Rating state interface
export interface RatingState {
  rating: number;
  promptAccuracy: number;
  styleAccuracy: number;
  showDetailedRatings: boolean;
}

// UI Style state interface
export interface StyleUiState {
  selectedStyle: string;
  cultureText: string;
  cultureEnabled: boolean;
  availableStyles: string[];
}

// Error state interface
export interface ErrorState {
  apiError: string | null;
  showApiError: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AiSymbolStateService {

  // Configurations for different styles, loaded from assets
  private styleConfigs: Record<string, StyleConfig> = {};
  private configLoaded = false;

   // Dyvogra
    // Jellow

  // Gallery state management
  private _galleryState$ = new BehaviorSubject<GalleryState>({
    generatedImages: [],
    originalImages: [],
    selectedImageIndex: null,
    isGenerated: false,
    showImages: false,
    isLoading: false,
    isRefreshing: false,
    progressBars: [0, 0, 0, 0],
    queuePosition: null,
    estimatedWaitTime: null,
    jobId: null
  });

  // Rating state management
  private _ratingState$ = new BehaviorSubject<RatingState>({
    rating: 0,
    promptAccuracy: 0,
    styleAccuracy: 0,
    showDetailedRatings: false
  });

  // Style state management
  private _styleState$ = new BehaviorSubject<StyleUiState>({
    selectedStyle: 'Mulberry',
    cultureText: '',
    cultureEnabled: true,
    availableStyles: [] // Will be updated after config loads
  });

  // Error state management
  private _errorState$ = new BehaviorSubject<ErrorState>({
    apiError: null,
    showApiError: false
  });

  // Public observables
  readonly galleryState$: Observable<GalleryState> = this._galleryState$.asObservable();
  readonly ratingState$: Observable<RatingState> = this._ratingState$.asObservable();
  readonly styleState$: Observable<StyleUiState> = this._styleState$.asObservable();
  readonly errorState$: Observable<ErrorState> = this._errorState$.asObservable();

  // Computed observables
  readonly selectedImageUrl$: Observable<string> = combineLatest([
    this._galleryState$
  ]).pipe(
    map(([galleryState]) => {
      if (galleryState.selectedImageIndex !== null && galleryState.generatedImages[galleryState.selectedImageIndex]) {
        return galleryState.generatedImages[galleryState.selectedImageIndex];
      }
      return '';
    })
  );

  constructor(
    private http: HttpClient
  ) {
    // Load configuration from assets
    this.loadStyleConfigurations();
  }

  private async loadStyleConfigurations(): Promise<void> {
    try {
      // Use relative assets path so Angular resolves under current locale base href
      const config = await this.http.get<Record<string, StyleConfig>>('assets/ai-style-configs.json').toPromise();
      if (config) {
        this.styleConfigs = config;
        this.configLoaded = true;

        // Update available styles in the state
        this._styleState$.next({
          ...this._styleState$.value,
          availableStyles: Object.keys(config)
        });

        // Initialize style configuration with default style after config is loaded
        this.updateStyleConfiguration('Mulberry');
      }
    } catch (error) {
      console.error('[AiSymbolStateService] Failed to load style configurations:', error);
      // Fallback to empty config if loading fails
      this.configLoaded = true;
    }
  }

  // Gallery state methods
  setGeneratedImages(images: string[]): void {
    this._galleryState$.next({
      ...this._galleryState$.value,
      generatedImages: images,
      originalImages: images, // Store originals for undo functionality
      isGenerated: true,
      queuePosition: null, // Clear queue info when images are received
      estimatedWaitTime: null,
      jobId: null
    });
  }

  updateGeneratedImage(index: number, imageUrl: string): void {
    const currentState = this._galleryState$.value;
    const updatedImages = [...currentState.generatedImages];
    updatedImages[index] = imageUrl;

    this._galleryState$.next({
      ...currentState,
      generatedImages: updatedImages
      // Note: originalImages remains unchanged
    });
  }

  selectImage(index: number): void {
    this._galleryState$.next({
      ...this._galleryState$.value,
      selectedImageIndex: index
    });
    // Clear ratings when selecting a new image
    this.clearRatings();
  }

  clearSelection(): void {
    this._galleryState$.next({
      ...this._galleryState$.value,
      selectedImageIndex: null
    });
    this.clearRatings();
  }

  setLoading(loading: boolean): void {
    const currentState = this._galleryState$.value;
    this._galleryState$.next({
      ...currentState,
      isLoading: loading,
      // Clear queue info when processing starts (status changes from queued to processing)
      queuePosition: loading && currentState.queuePosition !== null ? null : currentState.queuePosition,
      estimatedWaitTime: loading && currentState.estimatedWaitTime !== null ? null : currentState.estimatedWaitTime
    });
  }

  setRefreshing(refreshing: boolean): void {
    this._galleryState$.next({
      ...this._galleryState$.value,
      isRefreshing: refreshing
    });
  }

  setShowImages(show: boolean): void {
    this._galleryState$.next({
      ...this._galleryState$.value,
      showImages: show
    });
  }

  setProgressBars(progressBars: number[]): void {
    const current = this._galleryState$.value.progressBars;
    // Avoid redundant emissions to prevent recursive loops
    if (current.length === progressBars.length && current.every((v, i) => v === progressBars[i])) {
      return;
    }
    this._galleryState$.next({
      ...this._galleryState$.value,
      progressBars: [...progressBars]
    });
  }

  updateProgressBar(index: number, progress: number): void {
    const currentProgressBars = [...this._galleryState$.value.progressBars];
    const clamped = Math.max(0, Math.min(100, Math.round(progress)));
    if (currentProgressBars[index] === clamped) {
      return;
    }
    currentProgressBars[index] = clamped;
    // Create a new array reference to ensure change detection
    this._galleryState$.next({
      ...this._galleryState$.value,
      progressBars: [...currentProgressBars]
    });
  }

  clearGalleryState(): void {
    this._galleryState$.next({
      generatedImages: [],
      originalImages: [],
      selectedImageIndex: null,
      isGenerated: false,
      showImages: false,
      isLoading: false,
      isRefreshing: false,
      progressBars: [0, 0, 0, 0],
      queuePosition: null,
      estimatedWaitTime: null,
      jobId: null
    });
  }

  setQueueInfo(position: number, waitTime: number, jobId: string): void {
    this._galleryState$.next({
      ...this._galleryState$.value,
      queuePosition: position,
      estimatedWaitTime: waitTime,
      jobId: jobId
    });
  }

  clearQueueInfo(): void {
    this._galleryState$.next({
      ...this._galleryState$.value,
      queuePosition: null,
      estimatedWaitTime: null,
      jobId: null
    });
  }

  // Rating state methods
  setRating(value: number): void {
    this._ratingState$.next({
      ...this._ratingState$.value,
      rating: value,
      showDetailedRatings: value > 0
    });
  }

  setPromptAccuracy(value: number): void {
    this._ratingState$.next({
      ...this._ratingState$.value,
      promptAccuracy: value
    });
  }

  setStyleAccuracy(value: number): void {
    this._ratingState$.next({
      ...this._ratingState$.value,
      styleAccuracy: value
    });
  }

  clearRatings(): void {
    this._ratingState$.next({
      rating: 0,
      promptAccuracy: 0,
      styleAccuracy: 0,
      showDetailedRatings: false
    });
  }

  // Style state methods
  setSelectedStyle(style: string): void {
    this._styleState$.next({
      ...this._styleState$.value,
      selectedStyle: style
    });
    this.updateStyleConfiguration(style);
  }

  setCultureText(text: string): void {
    this._styleState$.next({
      ...this._styleState$.value,
      cultureText: text
    });
  }


  private updateStyleConfiguration(styleName: string): void {
    if (!this.configLoaded) {
      console.warn('[AiSymbolStateService] Configuration not loaded yet, cannot update style configuration');
      return;
    }

    const config = this.styleConfigs[styleName];
    if (config) {
      this._styleState$.next({
        ...this._styleState$.value,
        cultureText: config.culture.enabled ? config.culture.defaultValue : '',
        cultureEnabled: config.culture.enabled
      });
    } else {
      console.warn('[AiSymbolStateService] Style configuration not found for:', styleName);
    }
  }

  getStyleConfiguration(styleName: string): StyleConfig | null {
    if (!this.configLoaded) {
      console.warn('[AiSymbolStateService] Configuration not loaded yet, cannot get style configuration');
      return null;
    }
    return this.styleConfigs[styleName] || null;
  }

  // Error state methods
  setApiError(message: string): void {
    this._errorState$.next({
      apiError: message,
      showApiError: true
    });
    // Stop loading states when error occurs
    this.setLoading(false);
    this.setRefreshing(false);
  }

  clearApiError(): void {
    this._errorState$.next({
      apiError: null,
      showApiError: false
    });
  }

  // Getter methods for current state values (for components that need immediate access)
  get currentGalleryState(): GalleryState {
    return this._galleryState$.value;
  }

  get currentRatingState(): RatingState {
    return this._ratingState$.value;
  }

  get currentStyleState(): StyleUiState {
    return this._styleState$.value;
  }

  get currentErrorState(): ErrorState {
    return this._errorState$.value;
  }

  get selectedImageUrl(): string {
    const state = this.currentGalleryState;
    if (state.selectedImageIndex !== null && state.generatedImages[state.selectedImageIndex]) {
      return state.generatedImages[state.selectedImageIndex];
    }
    return '';
  }

  // Comprehensive reset method - call this when starting fresh
  resetAllState(): void {
    // Reset all state to initial values
    this.clearGalleryState();
    this.clearRatings();
    this.clearApiError();
  }
}
