import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { AiSymbolStateService, StyleUiState, GalleryState } from '@data/services/ai-symbol-state.service';


@Component({
  selector: 'app-ai-controls',
  templateUrl: './ai-controls.component.html',
  styleUrls: ['./ai-controls.component.scss']
})
export class AiControlsComponent {
  @Input() showGenerateButton: boolean = true;
  @Input() generateButtonText: string = 'Generate';
  @Input() generateButtonDisabled: boolean = false;

  @Output() generateClicked = new EventEmitter<void>();
  @Output() examplesClicked = new EventEmitter<void>();

  // Access style state from service
  styleState$: Observable<StyleUiState> = this.stateService.styleState$;
  galleryState$: Observable<GalleryState> = this.stateService.galleryState$;

  constructor(private stateService: AiSymbolStateService) {}

  // Event handlers that update the state service
  onStyleChanged(newStyle: string): void {
    this.stateService.setSelectedStyle(newStyle);
  }

  openExamplesModal(): void {
    this.examplesClicked.emit();
  }

}