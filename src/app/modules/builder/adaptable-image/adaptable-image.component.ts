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

  imageUrl: string;

  svgData: SafeHtml;

  constructor(
    private symbolService: SymbolService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    this.imageUrl = (this.cell) ? this.cell.image_url : this.image;

    if (this.adaptable) {
      this.symbolService.getFile(this.imageUrl).subscribe(svg => this.svgData = svg);
    }
  }

}
