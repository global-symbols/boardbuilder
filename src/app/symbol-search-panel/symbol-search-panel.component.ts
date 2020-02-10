import {AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {GlobalSymbolsService} from '../global-symbols.service';
import {from, fromEvent, Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';
import {SymbolSearchResult} from '../models/symbol-search-result.model';
import {OpenSymbolsService} from '../open-symbols.service';

@Component({
  selector: 'app-symbol-search-panel',
  templateUrl: './symbol-search-panel.component.html',
  styleUrls: ['./symbol-search-panel.component.css']
})
export class SymbolSearchPanelComponent implements AfterViewInit {

  sources = [
    {
      key: 'gs',
      name: 'Global Symbols',
      params: [
        { key: 'symbol_set', label: 'Symbol Set', value: 'all', type: 'select', options: null, option_id: 'slug',
          allowBlank: { name: 'All Symbol Sets', value: 'all' }},
        { key: 'language', label: 'Language', value: '', type: 'select', options: null, option_id: 'iso639_3', },
      ]
    }, {
      key: 'os',
      name: 'Open Symbols',
      params: []
    },
  ];

  query: string;

  source;

  results;

  isSearching: boolean;

  @ViewChild('queryInput') queryInput: ElementRef;

  @Output() readonly selectionChange = new EventEmitter<string>();

  constructor(private globalSymbolsService: GlobalSymbolsService,
              private openSymbolsService: OpenSymbolsService) {
    this.isSearching = false;
    this.source = this.sources[0];
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
      this.isSearching = true;
      this.searchCall().subscribe((res) => {
        this.isSearching = false;
        this.results = res;
      }, (err) => {
        this.isSearching = false;
      });
    });
  }

  search() {
    this.searchCall().subscribe(results => this.results = results);
  }

  searchCall() {
    if (this.query !== '') {

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

        return from(this.globalSymbolsService.search(params));

      } else {
        return from(this.openSymbolsService.search(this.query));
      }

    }
  }

  selectImage(result: SymbolSearchResult) {
    this.selectionChange.emit(result.imageUrl);
  }
}
