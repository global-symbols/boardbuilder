import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {GlobalSymbolsService} from '../global-symbols.service';
import {BehaviorSubject, from, fromEvent, Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, finalize, flatMap, map} from 'rxjs/operators';
import {SymbolSearchResult} from '../models/symbol-search-result.model';
import {OpenSymbolsService} from '../open-symbols.service';

@Component({
  selector: 'app-symbol-search-panel',
  templateUrl: './symbol-search-panel.component.html',
  styleUrls: ['./symbol-search-panel.component.scss']
})
export class SymbolSearchPanelComponent implements AfterViewInit, OnInit {

  sources = [
    {
      key: 'gs',
      name: 'Global Symbols',
      params: [
        { key: 'symbol_set', label: 'Symbol Set', value: 'all', type: 'select', options: null, option_id: 'slug',
          allowBlank: { name: 'All Symbol Sets', value: 'all' }},
        { key: 'language', label: 'Language', value: 'eng', type: 'select', options: null, option_id: 'iso639_3', },
      ]
    }, {
      key: 'os',
      name: 'Open Symbols',
      params: []
    },
  ];

  query: string;
  source;

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private resultsSubject = new BehaviorSubject<SymbolSearchResult[]>(null);
  public results$ = this.resultsSubject.asObservable();

  @ViewChild('queryInput') queryInput: ElementRef;

  @Input() initialQuery: string;
  @Output() readonly selectionChange = new EventEmitter<string>();

  constructor(private globalSymbolsService: GlobalSymbolsService,
              private openSymbolsService: OpenSymbolsService) {
    this.source = this.sources[0];
  }

  ngOnInit(): void {
    this.globalSymbolsService.getLanguages().then(
      l => {
        const param = this.sources.find(s => s.key === 'gs').params.find(p => p.key === 'language');
        param.options = l;
        param.value = l[0].iso639_3;
      }
    );
    this.globalSymbolsService.getSymbolSets().then(
      ss => this.sources.find(s => s.key === 'gs').params.find(p => p.key === 'symbol_set').options = ss
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
        language: this.source.params.find(p => p.key === 'language').value,
        language_iso_format: '639-3',
        symbolset: this.source.params.find(p => p.key === 'symbol_set').value,
      };

      // Remove the symbolset param, if it's blank
      if (params.symbolset === 'all') { delete params.symbolset; }

      return from(this.globalSymbolsService.search(params)).pipe(finalize(() => {
        this.loadingSubject.next(false);
      }));

    } else {
      return from(this.openSymbolsService.search(this.query)).pipe(finalize(() => {
        this.loadingSubject.next(false);
      }));
    }
  }

  selectImage(result: SymbolSearchResult) {
    this.selectionChange.emit(result.imageUrl);
  }
}
