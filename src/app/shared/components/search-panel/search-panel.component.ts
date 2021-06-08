import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {GlobalSymbolsService} from '@data/services/global-symbols.service';
import {BehaviorSubject, from, fromEvent, Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, finalize, map} from 'rxjs/operators';
import {SymbolSearchResult} from '@data/models/symbol-search-result';
import {SymbolService} from '@data/services/symbol.service';
import {Symbolset} from '@data/models/symbolset';
import {Language} from '@data/models/language';

@Component({
  selector: 'app-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.scss']
})
export class SearchPanelComponent implements AfterViewInit, OnInit {

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

  @Input() initialQuery: string;
  @Output() readonly selectionChange = new EventEmitter<SymbolSearchResult>();

  constructor(private globalSymbolsService: GlobalSymbolsService,
              private symbolService: SymbolService) {

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
        param.options = languages;
        param.value = languages[0].iso639_3;
      }
    );
    this.globalSymbolsService.getSymbolSets().subscribe(
      ss => this.gsParams.symbolset.groups = [
        { name: 'Core Sets', options: ss.filter(q => q.featured_level)},
        { name: 'Other Sets', options: ss.filter(q => !q.featured_level)},
      ]
    );

    this.query = this.initialQuery;
  }

  ngAfterViewInit() {
    fromEvent(this.queryInput.nativeElement, 'keyup').pipe(

      // get value
      map((event: any) => event.target.value),

      // if character length greater then 0
      filter(res => res.length > 0),

      // Time in milliseconds between key events
      debounceTime(500),

      // If previous query is different from current
      distinctUntilChanged()

      // subscription for response
    ).subscribe((text: string) => {
      if (this.query !== '') {
        this.searchCall().subscribe(results => {
          this.resultsSubject.next(results);
        });
      }
    });
  }

  search() {
    this.searchCall().subscribe(results => {
      this.resultsSubject.next(results);
    });
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
    this.selectionChange.emit(result);
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
