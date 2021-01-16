import {Component, Input, OnChanges} from '@angular/core';
import {Board} from '@data/models/board.model';
import {PageSize} from '@data/models/page-size.model';

interface BoardPreviewSvgThumbnail {
  height: number;
  width: number;
  x: number;
  y: number;
}

@Component({
  selector: 'app-board-preview-svg',
  templateUrl: './board-preview-svg.component.svg',
  styleUrls: ['./board-preview-svg.component.scss']
})
export class BoardPreviewSvgComponent implements OnChanges {

  @Input() board: Board;

  // Target paper size. Defaults to A4.
  @Input() paper: PageSize = new PageSize({
    name: 'A4',
    x: 210,
    y: 297
  });

  @Input() selected: boolean;

  @Input() size: number;
  @Input() maxHeight: number;
  @Input() maxWidth: number;

  // We use a random ID to avoid clashes between IDs of re-used SVG elements, when this component is used more than once in a page.
  randomId: number;

  svgHeight: string | number;
  svgWidth: string | number;

  // Cell spacing to apply, as a fraction of the shortest dimension of the Cell.
  private cellSpacingFraction = 0.2;

  // Page padding to apply, as a fraction of the shortest dimension of the Paper.
  private pagePaddingFraction = 0.1;

  height: number;
  width: number;

  viewBox: string;
  innerPageViewBox: string;
  innerPageTranslate: string;

  pageOutlineColour = '#6b6b6b';
  pageOutlineWidth: number;

  pagePadding: number;
  cellSpacing: number;

  pageInnerHeight: number;
  pageInnerWidth: number;

  thumbnails: BoardPreviewSvgThumbnail[];

  constructor() {
    this.generateRandomId(1, 100000000);
  }

  ngOnChanges(): void {
    this.calculatePageDimensions();

    this.pagePadding = this.paper.shortEdge * this.pagePaddingFraction;

    this.pageInnerHeight = this.height - this.pagePadding * 2;
    this.pageInnerWidth = this.width - this.pagePadding * 2;

    this.calculateCellSpacing();

    // The inner page is a <g> group that contains the grid of cells.
    // It is translated into place so we don't have to include pagePadding in cell position calculations.
    this.innerPageTranslate = `translate(${this.pagePadding} ${this.pagePadding})`;

    this.viewBox = `0 0 ${this.width} ${this.height}`;
    this.innerPageViewBox = `${this.pagePadding} ${this.pagePadding} ${this.width - this.pagePadding * 2} ${this.height - this.pagePadding * 2}`;

    this.pageOutlineWidth = this.paper.longEdge / 55;

    this.thumbnails = [];

    const cellWidth  = (this.pageInnerWidth - this.cellSpacing * (this.board.columns - 1)) / this.board.columns;
    const cellHeight = (this.pageInnerHeight - this.cellSpacing * (this.board.rows - 1)) / this.board.rows;

    // Set Cell Y to zero.
    let cellY = 0;

    for (let row = 1; row <= this.board.rows; row++) {

      // Reset Cell X to zero.
      let cellX = 0;

      for (let col = 1; col <= this.board.columns; col++) {

        this.thumbnails.push({
          x: cellX,
          y: cellY,
          height: cellHeight,
          width: cellWidth
        });

        // Incremenent CellX.
        cellX = cellX + cellWidth + this.cellSpacing;
      }

      // Incremenent CellY.
      cellY = cellY + cellHeight + this.cellSpacing;
    }
  }

  private calculateCellSpacing() {
    const maxSymbols = Math.max.apply(Math, [this.board.rows, this.board.columns]);
    const maxDimension = Math.max.apply(Math, [this.pageInnerHeight, this.pageInnerWidth]);
    this.cellSpacing = (maxDimension / maxSymbols) * this.cellSpacingFraction;
  }

  // Work out if landscape or portrait is best for this chart.
  private calculatePageDimensions() {
    // When labels are to go left or right, cells will be wider
    // This effectively treats cells with a left/right caption as double-width.
    const cellWidthMultiplier = ['left', 'right'].includes(this.board.captions_position) ? 2 : 1;

    if (this.board.rows > (this.board.columns * cellWidthMultiplier)) {
      // Portrait
      this.height = this.paper.longEdge;
      this.width = this.paper.shortEdge;
      this.svgWidth = 'auto';
      this.svgHeight = this.size;
    } else {
      // Landscape
      this.height = this.paper.shortEdge;
      this.width = this.paper.longEdge;
      this.svgWidth = this.size;
      this.svgHeight = 'auto';
    }
  }

  private generateRandomId(min, max) {
    this.randomId = Math.floor(Math.random() * (max - min) + min);
  }
}
