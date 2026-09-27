import {AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, LOCALE_ID, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {GlobalSymbolsService} from '@data/services/global-symbols.service';
import {BehaviorSubject, from, fromEvent, Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, finalize, map} from 'rxjs/operators';
import {SymbolSearchResult} from '@data/models/symbol-search-result';
import {SymbolService} from '@data/services/symbol.service';
import {Symbolset} from '@data/models/symbolset';
import {Language} from '@data/models/language';
import {DialogService} from '@app/services/dialog.service';
import { Media } from '@data/models/media.model'; // Add this
import { MediaUpdateService } from '@data/services/media-update.service'; // Add this
import { Cell } from '@data/models/cell.model';
// Removed: ImageActionDialogComponent, ImageAction, ImageActionDialogData - no longer used since we skip the dialog
import { SearchResultConverterService } from '@shared/services/search-result-converter.service';
import { SymbolSearchPreferencesService } from '@shared/services/symbol-search-preferences.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.scss']
})
export class SearchPanelComponent implements AfterViewInit, OnChanges, OnInit {

  sources = [];

  query: string;
  source: any;

  gsParams: {
    symbolset: GroupedGsParam<Symbolset>;
    language: FlatGsParam<Language>;
  };

  // Initialised to null, which means no search has been performed yet.
  // Then changes to true/false
  private loadingSubject = new BehaviorSubject<boolean>(null);
  public loading$ = this.loadingSubject.asObservable();

  private resultsSubject = new BehaviorSubject<SymbolSearchResult[]>(null);
  public results$ = this.resultsSubject.asObservable();

  @ViewChild('queryInput') queryInput: ElementRef;

  private captionSearch$ = new Subject<string>();

  @Input() initialQuery: string;
  @Input() sourceCellId: number;
  @Input() showCreationButtons: boolean = false;
  @Output() readonly selectionChange = new EventEmitter<SymbolSearchResult>();
  @Output() readonly mediaCreated = new EventEmitter<Media>(); // Add this to notify parent
  @Output() readonly cellDataSelected = new EventEmitter<Partial<Cell>>(); // For direct cell population


  constructor(
    private globalSymbolsService: GlobalSymbolsService,
    private symbolService: SymbolService,
    private dialogService: DialogService,
    private mediaUpdateService: MediaUpdateService,
    private dialog: MatDialog,
    private searchResultConverter: SearchResultConverterService,
    private symbolSearchPreferences: SymbolSearchPreferencesService,
    @Inject(LOCALE_ID) public locale: string
  ) {

    this.sources = this.globalSymbolsService.sources;
    this.source = this.sources[0];

    this.gsParams = {
      symbolset: { value: 'all', groups: [] },
      language: { value: 'eng', options: [] }
    };

  }

  ngOnInit(): void {
    this.globalSymbolsService.getLanguages().subscribe(
      languages => {
        const param = this.gsParams.language;
        param.options = languages || [];
        if (!param.options.length) { return; }

        // Default the language param to the current locale.
        // First, get the main locale (e.g. 'en' for 'en-gb', or 'fr' for 'fr').
        const localeMatch = this.locale && this.locale.match(/^(\w+)/);
        const currentLocaleBase = localeMatch ? localeMatch[1] : 'en';
        const localeDefault =
          languages.find(l => l.iso639_1 === currentLocaleBase)?.iso639_3 || languages[0].iso639_3;

        const stored = this.symbolSearchPreferences.getPreferredGsLanguage();
        param.value =
          stored && languages.some(l => l.iso639_3 === stored) ? stored : localeDefault;
      },
      () => {
        this.gsParams.language.options = [];
      }
    );
    this.globalSymbolsService.getSymbolSets().subscribe(
      ss => this.gsParams.symbolset.groups = [
        { name: $localize`Core Sets`, options: ss.filter(q => q.featured_level)},
        { name: $localize`Other Sets`, options: ss.filter(q => !q.featured_level)},
      ],
      () => {
        this.gsParams.symbolset.groups = [];
      }
    );

    this.query = this.initialQuery || '';
    this.captionSearch$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      filter(value => !!value && value.trim().length > 0)
    ).subscribe(() => this.search());
  }

  ngOnChanges(changes: SimpleChanges) {
    const cellChanged = changes.sourceCellId
      && !changes.sourceCellId.firstChange
      && changes.sourceCellId.previousValue !== changes.sourceCellId.currentValue;
    if (cellChanged) {
      this.query = this.initialQuery || '';
      this.resultsSubject.next(null);
      this.loadingSubject.next(null);
      return;
    }
    if (!changes.initialQuery || changes.initialQuery.firstChange) { return; }
    this.query = this.initialQuery || '';
    if (!this.query.trim()) {
      this.resultsSubject.next(null);
      this.loadingSubject.next(null);
      return;
    }
    this.captionSearch$.next(this.query);
  }

  ngAfterViewInit() {
    fromEvent(this.queryInput.nativeElement, 'keyup').pipe(
      filter((event: KeyboardEvent) => event.key !== 'Enter'),
      map((event: KeyboardEvent) => (event.target as HTMLInputElement).value),
      filter(value => value.length > 0),
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(() => this.search());
  }

  search() {
    if (!this.query || !this.query.trim()) { return; }
    this.searchCall().subscribe(results => {
      this.resultsSubject.next(results);
    });
  }

  onGsLanguageChange(): void {
    this.symbolSearchPreferences.setPreferredGsLanguage(this.gsParams.language.value);
  }

  searchCall(): Observable<SymbolSearchResult[]> {
    this.loadingSubject.next(true);
    if (this.source.key === 'gs') {
      // Build params
      const params = {
        query: this.query,
        language: this.gsParams.language.value,
        language_iso_format: '639-3',
        symbolset: this.gsParams.symbolset.value,
        limit: 48,
        expand: 'picto.symbolset'
      };

      // Remove the symbolset param, if it's blank
      if (params.symbolset === 'all') { delete params.symbolset; }

      return from(this.globalSymbolsService.search(params)).pipe(finalize(() => {
        this.loadingSubject.next(false);
      }));

    } else {
      return from(this.symbolService.search(this.query, this.source)).pipe(finalize(() => {
        this.loadingSubject.next(false);
      }));
    }
  }

  selectImage(result: SymbolSearchResult) {
    // Directly use the image without showing the action dialog
    this.handleUseAsIs(result);
  }

  /**
   * COMMENTED OUT: handleImageAction method - no longer needed since we skip the dialog and directly use images
   * Previously handled USE_AS_IS and SEND_TO_AI actions from the ImageActionDialogComponent
   * @param result - The selected search result
   * @param action - The action chosen by the user (USE_AS_IS or SEND_TO_AI)
   */
  // private handleImageAction(result: SymbolSearchResult, action: ImageAction): void {
  //   switch (action) {
  //     case ImageAction.USE_AS_IS:
  //       console.log('[SearchPanel] Handling USE_AS_IS action');
  //       this.handleUseAsIs(result);
  //       break;
  //
  //     case ImageAction.SEND_TO_AI:
  //       console.log('[SearchPanel] Handling SEND_TO_AI action');
  //       this.handleSendToAI(result);
  //       break;
  //
  //     default:
  //       console.warn('[SearchPanel] Unknown action:', action);
  //   }
  // }

  /**
   * Handles the "Use as-is" action - converts search result to cell data and emits it
   * @param result - The search result to convert
   */
  private handleUseAsIs(result: SymbolSearchResult): void {
    const cellData = this.searchResultConverter.convertToCellData(result);

    this.cellDataSelected.emit(cellData);
    
    // Also emit the original selectionChange for backward compatibility
    this.selectionChange.emit(result);
  }

  /**
   * Handles the "Send to AI" action - opens the AI creator in text mode
   * (Image mode functionality preserved but hidden from UI)
   * @param result - The search result (image mode disabled, opens text mode instead)
   */
  private async handleSendToAI(result: SymbolSearchResult): Promise<void> {
    try {
      // Open regular AI dialog in text mode (image mode functionality commented out)
      const dialogRef = this.dialogService.openSymbolCreatorAI(undefined, 'boardset');

      dialogRef.componentInstance.parentDialogRef = dialogRef; // Pass the dialog reference
      dialogRef.afterClosed().subscribe((mediaItem: Media) => {
        if (mediaItem) {
          this.mediaUpdateService.triggerUpdate(mediaItem);
        } else {
          // AI Dialog cancelled
        }
      });

    } catch (error) {
      console.error('[SearchPanel] Failed to open AI designer:', error);
    }
  }


  
openSymbolCreator() {
    const currentDialogRef = this.dialogService.openSymbolCreator();
    currentDialogRef.afterClosed().subscribe((mediaItem: Media) => {
      if (mediaItem) {
        this.mediaUpdateService.triggerUpdate(mediaItem); // Use service instead of mediaCreated
      }
    });
  }

  openSymbolCreatorAI() {
    const currentDialogRef = this.dialogService.openSymbolCreatorAI(undefined, 'boardset');

    currentDialogRef.componentInstance.parentDialogRef = currentDialogRef; // Pass the dialog reference to PromptModeComponent
    currentDialogRef.afterClosed().subscribe((mediaItem: Media) => {
      if (mediaItem) {
        this.mediaUpdateService.triggerUpdate(mediaItem); // Use service instead of mediaCreated
      }
    });
  }
  
}

interface FlatGsParam<T> {
  value: string;
  options: Array<T>;
}

interface GroupedGsParam<T> {
  value: string;
  groups: Array<{name: string, options: Array<T>}>;
}
