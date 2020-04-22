import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BoardSetService} from '../board-set.service';
import {Board} from '../models/board.model';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {ImageBase64Service} from '../image-base64.service';
import {HttpClient} from '@angular/common/http';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {BoardSet} from '../models/boardset.model';
import {Hotkey, HotkeysService} from 'angular2-hotkeys';
import {Location} from '@angular/common';

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.css']
})
export class PdfComponent implements OnInit {

  generatingPdf = true;
  pdfReady = false;

  boardSet: BoardSet;
  board: Board;
  pdfMake;
  pdfDefinition: object;
  compiledPdf;
  failureReason: string;

  images = {};

  cellSpacing = 10;

  @ViewChild('pdfFrame') pdfFrame: ElementRef;

  constructor(private service: BoardSetService,
              private route: ActivatedRoute,
              private router: Router,
              private location: Location,
              private sanitiser: DomSanitizer,
              private imageBase64Service: ImageBase64Service,
              private http: HttpClient,
              private hotkeysService: HotkeysService) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    this.pdfMake = pdfMake;

    // Keyboard shortcut - delete Board
    this.hotkeysService.add(new Hotkey('escape', (event: KeyboardEvent): boolean => {
      this.returnToBoard();
      return false; // Prevent bubbling
    }));
  }

  ngOnInit() {
    this.getBoard().then(bs => {

      if (!this.board) { return this.error('The Board could not be loaded.'); }

      try {
        // Collect the images as Base64 and generatePDF() when all images are downloaded and ready.
        this.board.cells.map(cell => {
          // If an image is present and IS NOT an SVG, get it as Base64.
          if (cell.url && !cell.url.endsWith('.svg')) {
            this.imageBase64Service.getFromURL(cell.url).then(image => {
              this.images[cell.id] = {base64: image};
              this.generatePdfIfImagesReady();
            });

            // If an image is present and IS an SVG, get it as text.
          } else if (cell.url && cell.url.endsWith('.svg')) {

            this.http.get(cell.url, {
              responseType: 'text'
            }).toPromise().then(result => {

              // Remove the width and height attributes from the <svg> element, if they are present.
              // Leaving them in causes the SVG to be rendered full-size.
              // Regex dotall (/s flag) is not supported in Firefox, so we have to use [^] instead of '.'.
              result = result.replace(/(<svg[^]*?)width=['"][^]+?['"]([^]+?>)/gm, '$1$2');
              result = result.replace(/(<svg[^]*?)height=['"][^]+?['"]([^]+?>)/gm, '$1$2');

              // Remove XML headers from the SVG.
              // SVGs returned by OpenSymbols have headers that break the SVG converter, so we'll just remove them.
              result = result.replace(/^[^]*?<svg/, '<svg');

              this.images[cell.id] = {svg: result};
              this.generatePdfIfImagesReady();

            });

          // If no image is present in the Cell, pop in a dummy SVG.
          } else {
            this.images[cell.id] = {svg: '<svg viewBox="0 0 500 500"></svg>'};
            this.generatePdfIfImagesReady();
          }
        });
      } catch (error) {
        return this.error(error);
      }
    });
  }

  private generatePdfIfImagesReady(): void {
    if (this.imagesReady()) { this.generatePDF(); }
  }

  private imagesReady(): boolean {
    return Object.keys(this.images).length === this.board.cells.length;
  }

  error(reason: string) {
    this.failureReason = reason;
    this.generatingPdf = false;
    this.pdfReady = false;
    return null;
  }

  generatePDF() {
    const widths = [];
    const heights = [];
    const imageFit = 480 / this.board.columns; // e.g. 120 for 4-wide grids.

    const spacerRow = [{ text: '', height: this.cellSpacing, colSpan: this.board.columns + (this.board.columns - 1) }];

    // Get the Cells as a matrix (rows * columns), and adjust each Cell to match pdfMake's format.
    // This outputs 2-item arrays. Item 0 is the Cell, item 2 is an empty spacer cell.
    // The spacer is omitted on the last cell in the row.
    // Afterwards, the array of 2-item arrays is flattened into a single array of Cells and Spacers.
    const cells = [];
    this.board.cellsAsMatrix().map((row, rowNumber) => {
      row = row.map((cell, cellNumber) => {

        let imageDefinition: any = {};
        if (this.images[cell.id] !== null) {
          imageDefinition = {
            fit: [imageFit, imageFit],
            alignment: 'center'
          };

          // For base64 images, use the 'image' key
          if (this.images[cell.id].base64) {
            imageDefinition.image = this.images[cell.id].base64;
          }

          // For SVGs, use the 'svg' key
          if (this.images[cell.id].svg) {
            imageDefinition.svg = this.images[cell.id].svg;
            imageDefinition.height = imageFit;
          }
        }

        const textDefinition = {
          text: cell.caption || ' '
        };

        // PDFMake can't handle rgb(0,0,0) values yet, so convert these to hex.
        let borderColour = cell.borderColour ? cell.borderColour : '#000000';
        if (cell.borderColour?.startsWith('rgb')) {
          borderColour = this.rgbToHex(borderColour);
        }

        let backgroundColour = cell.backgroundColour;
        if (cell.backgroundColour?.startsWith('rgb')) {
          backgroundColour = this.rgbToHex(backgroundColour);
        }

        const cellDefinition = {
          stack: [],
          fillColor: backgroundColour,
          border: [true, true, true, true],
          borderColor: [borderColour, borderColour, borderColour, borderColour],
          style: 'imageCell'
        };

        if (this.board.defaultCellFormat.labelPosition === 'top') {
          cellDefinition.stack.push(textDefinition);
        }

        cellDefinition.stack.push(imageDefinition);

        if (this.board.defaultCellFormat.labelPosition === 'bottom') {
          cellDefinition.stack.push(textDefinition);
        }

        // Generate widths on the first row only.
        if (rowNumber === 0) {
          // Push an auto-width to Widths for the Cell.
          widths.push('*');

          // If this cell has a spacer cell after it, add a width for the spacer too.
          if ((cellNumber + 1) < this.board.columns) {
            widths.push(this.cellSpacing);
          }
        }

        // Return an array of the cell and spacer, or just the cell if this is the last in the row.
        return ((cellNumber + 1) === this.board.columns) ? cellDefinition : [cellDefinition, ''];
      }).flat();

      // Add a height for the image row.
      // For auto-height, pass '*'.
      heights.push(150);
      cells.push(row);

      if ((rowNumber + 1) < this.board.rows) {
        heights.push(this.cellSpacing);
        cells.push(spacerRow);
      }

      // Return an array of the row and spacer row, or just the row if this is the last row.
      return ((rowNumber + 1) === this.board.rows) ? row : [row, spacerRow]; // TODO: Set colspan on the spacer.
    });

    // console.log(cells);

    const layout = {
      // paddingTop: () => 20,
      defaultBorder: false,
    };

    this.pdfDefinition = {
      pageOrientation: (this.board.rows > this.board.columns) ? 'portrait' : 'landscape',
      styles: {
        imageCell: {
          alignment: 'center'
        }
      },
      info: {
        title: this.board.title,
        producer: 'GlobalSymbols Board Builder'
      },
      content: [
        {
          // layout: 'a4',
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 0,
            widths, // All cols should have equal width
            heights,
            body: cells
          },
          layout
        }
      ]
    };

    this.compiledPdf = this.pdfMake.createPdf(this.pdfDefinition);

    this.compiledPdf.getDataUrl((dataUrl) => {
      this.pdfFrame.nativeElement.src = dataUrl;
      this.generatingPdf = false;
      this.pdfReady = true;
    });
  }

  downloadPdf() {
    this.compiledPdf.download();
  }

  private getBoard() {
    return this.service.getBoardSet(this.route.snapshot.paramMap.get('boardset_id'))
      .then(bs => {
        this.boardSet = bs;
        this.board = bs.findBoard(this.route.snapshot.paramMap.get('board_id'));
      });
  }

  returnToBoard() {
    if (this.boardSet && this.board) {
      this.router.navigate(['/', 'boardsets', this.boardSet.uuid], {
        queryParams: {board: this.board.uuid}
      });
    } else {
      this.location.back();
    }

  }

  // Converts a rgb(0,0,0) colour value into hex format.
  private rgbToHex(rgb) {
    const parts = rgb.substring(rgb.indexOf('(')).split(',');
    const r = parseInt(parts[0].substring(1).trim(), 10);
    const g = parseInt(parts[1].trim(), 10);
    const b = parseInt(parts[2].trim(), 10);
    // const a = parseFloat(parts[3].substring(0, parts[3].length - 1).trim()).toFixed(2);

    return ('#' +
      r.toString(16) +
      g.toString(16) +
      b.toString(16));
      // (a * 255).toString(16).substring(0, 2));
  }
}
