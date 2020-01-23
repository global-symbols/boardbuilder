import { Component, OnInit } from '@angular/core';
import {GlobalSymbolsService} from '../global-symbols.service';

@Component({
  selector: 'app-symbol-search-dialog',
  templateUrl: './symbol-search-dialog.component.html',
  styleUrls: ['./symbol-search-dialog.component.css']
})
export class SymbolSearchDialogComponent implements OnInit {

  sources = [
    {
      key: 'gs',
      name: 'Global Symbols',
      params: [
        { key: 'query', label: 'Search for', value: '', type: 'text', options: null},
        { key: 'symbol_set', label: 'Symbol Set', value: '', type: 'select', options: null, option_id: 'slug',
          allowBlank: 'All Symbol Sets'},
        { key: 'language', label: 'Language', value: '', type: 'select', options: null, option_id: 'iso639_3', },
      ]
    }, {
    key: 'os',
    name: 'Open Symbols',
      params: [
        { key: 'query', label: 'Search for', value: '', type: 'text', options: null}
      ]
    },
  ];

  source;

  results;

  constructor(private globalSymbolsService: GlobalSymbolsService) {
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

  ngOnInit() {
  }

  search() {
    if (this.source.params.find(p => p.key === 'query').value !== '') {

      // Build params
      const params = {
        query: this.source.params.find(p => p.key === 'query').value,
        language: this.source.params.find(p => p.key === 'language').value,
        language_iso_format: '639-3',
        symbolset: this.source.params.find(p => p.key === 'symbol_set').value,
      };

      // Remove the symbolset param, if it's blank
      if (params.symbolset === '') { delete params.symbolset; }

      this.globalSymbolsService.searchLabels(params).then(r => this.results = r);
    }


  }

}
