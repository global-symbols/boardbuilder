import {Component, ElementRef, Inject, OnInit, SecurityContext, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Board} from '../models/board.model';
import {DomSanitizer} from '@angular/platform-browser';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {ImageBase64Service} from '../image-base64.service';

@Component({
  selector: 'app-pdf-dialog',
  templateUrl: './pdf-dialog.component.html',
  styleUrls: ['./pdf-dialog.component.css']
})
export class PdfDialogComponent implements OnInit {

  board: Board;
  pdfMake;
  pdfOutput;
  pdfDefinition: object;
  compiledPdf;

  images = {};

  @ViewChild('pdfFrame') pdfFrame: ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) board: Board,
              private sanitiser: DomSanitizer,
              private imageBase64Service: ImageBase64Service) {

    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    this.pdfMake = pdfMake;
    this.board = board;
  }

  ngOnInit(): void {

    // Collect the images as Base64 and generatePDF() when all images are downloaded and ready.
    this.board.cells.map(cell => {
      // If an image is present, get it as Base64.
      if (cell.url) {
        this.imageBase64Service.getFromURL(cell.url).then(image => {
          this.images[cell.id] = image;
          if (this.imagesReady()) { this.generatePDF(); }
        });
      } else {
        this.images[cell.id] = null;
        if (this.imagesReady()) { this.generatePDF(); }
      }
    });

  }

  private imagesReady(): boolean {
    return Object.keys(this.images).length === this.board.cells.length;
  }

  generatePDF() {

    // Get the Cells as a matrix (rows * columns), and adjust each Cell to match pdfMake's format.
    const cells = this.board.cellsAsMatrix().map(row => row.map(cell => {

      const imageDefinition = (this.images[cell.id] === null) ? {} : {
        image: this.images[cell.id],
        fit: [90, 90],
        alignment: 'center'
      };

      const textDefinition = {
        text: cell.caption || '[no caption]',
        style: 'standardCell',
        cellGap: 100
      };

      const cellDefinition = {
        stack: [],
        fillColor: cell.backgroundColour
      };

      if (this.board.defaultCellFormat.labelPosition === 'top') { cellDefinition.stack.push(textDefinition); }

      cellDefinition.stack.push(imageDefinition);

      if (this.board.defaultCellFormat.labelPosition === 'bottom') { cellDefinition.stack.push(textDefinition); }

      return cellDefinition;
    }));

    console.log(cells);

    this.pdfDefinition = {
      pageOrientation: (this.board.rows > this.board.columns) ? 'portrait' : 'landscape',
      styles: {
        standardCell: {
          alignment: 'center'
        }
      },
      content: [
        {
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 0,
            widths: '*', // All cols should have equal width

            body: cells
          }
        }
      ]
    };

    this.compiledPdf = this.pdfMake.createPdf(this.pdfDefinition);

    this.compiledPdf.getDataUrl((dataUrl) => {
      this.pdfFrame.nativeElement.src = dataUrl;
    });
  }

  downloadPdf() {
    this.compiledPdf.download();
  }
}
