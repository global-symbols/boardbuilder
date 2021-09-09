import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {SymbolService} from '@data/services/symbol.service';
import {SafeHtml} from '@angular/platform-browser';
import {Cell} from '@data/models/cell.model';

@Component({
  selector: 'app-adaptable-image',
  templateUrl: './adaptable-image.component.html',
  styleUrls: ['./adaptable-image.component.scss']
})
export class AdaptableImageComponent implements OnChanges {

  @Input() cell: Cell;
  @Input() image: string;
  @Input() adaptable: boolean;

  svgData: SafeHtml;

  constructor(
    private symbolService: SymbolService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (this.adaptable) {
      this.symbolService.getFile(this.image).subscribe(svg => this.svgData = svg);
    }
  }

}
