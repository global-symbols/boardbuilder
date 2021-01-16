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
  @Input() paper: PageSize = new PageSize({
    name: 'A4',
    x: 210,
    y: 297
  });

  height: number;
  width: number;

  viewBox: string;
  innerPageViewBox: string;
  innerPageTranslate: string;

  pageOutlineColour = '#6b6b6b';
  pageOutlineWidth: number;

  // symbolSize = 24;

  pagePadding = 20;

  pageInnerHeight: number;
  pageInnerWidth: number;

  thumbnails: BoardPreviewSvgThumbnail[];

  constructor() { }

  ngOnChanges(): void {
    if (this.board.rows > this.board.columns) {
      this.height = this.paper.longEdge;
      this.width = this.paper.shortEdge;
    } else {
      this.height = this.paper.shortEdge;
      this.width = this.paper.longEdge;
    }

    this.pageInnerHeight = this.height - this.pagePadding * 2;
    this.pageInnerWidth = this.width - this.pagePadding * 2;

    this.innerPageTranslate = `translate(${this.pagePadding} ${this.pagePadding})`;

    this.viewBox = `0 0 ${this.width} ${this.height}`;
    this.innerPageViewBox = `${this.pagePadding} ${this.pagePadding} ${this.width - this.pagePadding * 2} ${this.height - this.pagePadding * 2}`;

    this.pageOutlineWidth = this.height / 26.25;

    this.thumbnails = [];

    for (let row = 1; row <= this.board.rows; row++) {

      const cellY = this.pageInnerHeight / this.board.rows * (row - 1);

      for (let col = 1; col <= this.board.columns; col++) {

        const cellX = this.pageInnerWidth / this.board.columns * (col - 1);

        this.thumbnails.push({
          x: cellX,
          y: cellY,
          height: this.pageInnerHeight / this.board.rows,
          width: this.pageInnerWidth / this.board.columns,
        });

      }
    }
    console.log(this);
  }

}
