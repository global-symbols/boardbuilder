import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-symbol-search-dialog',
  templateUrl: './symbol-search-dialog.component.html',
  styleUrls: ['./symbol-search-dialog.component.css']
})
export class SymbolSearchDialogComponent implements OnInit {

  sources = [
    {
      name: 'Global Symbols',
      params: [{key: 'query', label: 'Search for', value: ''},
        {key: 'symbol_set', label: 'Symbol Set', value: ''},
        {key: 'language', label: 'Language', value: ''},
        {key: 'search_in', label: 'Search In', value: ''}]

    },
    {
      name: 'Open Symbols',
      params: [{key: 'query', label: 'Search for', value: ''}]
    },
  ];

  source;

  constructor() {
    this.source = this.sources[0];
  }

  ngOnInit() {
  }

}
