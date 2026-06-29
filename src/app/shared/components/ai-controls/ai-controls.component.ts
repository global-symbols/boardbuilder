import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
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

  @ViewChild('cultureTooltip') cultureTooltip: MatTooltip;

  cultureTooltipDisabled = true;

  // Access style state from service
  styleState$: Observable<StyleUiState> = this.stateService.styleState$;
  galleryState$: Observable<GalleryState> = this.stateService.galleryState$;

  constructor(private stateService: AiSymbolStateService) {}

  // Event handlers that update the state service
  onStyleChanged(newStyle: string): void {
    this.stateService.setSelectedStyle(newStyle);
  }

  onCultureClick(): void {
    if (!this.cultureTooltip) {
      return;
    }

    this.cultureTooltipDisabled = false;
    this.cultureTooltip.show();

    setTimeout(() => {
      this.cultureTooltip.hide();
      this.cultureTooltipDisabled = true;
    }, 2000);
  }

  openExamplesModal(): void {
    this.examplesClicked.emit();
  }

}