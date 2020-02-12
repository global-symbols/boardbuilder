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

    const body = [];

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

      const cellDefinition = [];

      if (this.board.defaultCellFormat.labelPosition === 'top') { cellDefinition.push(textDefinition); }

      cellDefinition.push(imageDefinition);

      if (this.board.defaultCellFormat.labelPosition === 'bottom') { cellDefinition.push(textDefinition); }



      return cellDefinition;
    }));

    console.log(cells);
    console.log([
      [ 'First', 'Second', 'Third', 'The last one' ],
      [ 'Value 1', 'Value 2  a dsklkal dsjlkads jl jlkasd ', 'Value 3', 'Value 4' ],
      [ { text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4' ]
    ]);

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

            body: cells,
            bodys: [
              [ 'First', 'Second', 'Third', 'The last one' ],
              [ 'Value 1', 'Value 2  a dsklkal dsjlkads jl jlkasd ', 'Value 3', 'Value 4' ],
              [ { text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4' ]
            ]
          }
        }
      ]
    };

    // this.pdfMake.createPdf(pdfDefinition).download();

    this.compiledPdf = this.pdfMake.createPdf(this.pdfDefinition);

    this.compiledPdf.getDataUrl((dataUrl) => {
      // this.pdfOutput = dataUrl;
      this.pdfFrame.nativeElement.src = dataUrl;
      // const targetElement = document.querySelector('#iframeContainer');
      // const iframe = document.createElement('iframe');
      // iframe.src = dataUrl;
      // targetElement.appendChild(iframe);
    });

    // this.pdfOutput = this.sanitiser.sanitize(
    //   SecurityContext.NONE, this.sanitiser.bypassSecurityTrustResourceUrl(this.pdf.output('datauristring'))
    // );
    // this.pdf.save('test.pdf');
  }

  downloadPdf() {
    this.compiledPdf.download();
  }
}
