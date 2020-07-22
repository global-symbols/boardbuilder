import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Board} from '@data/models/board.model';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {ImageBase64Service} from '@data/services/image-base64.service';
import {HttpClient} from '@angular/common/http';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {Hotkey, HotkeysService} from 'angular2-hotkeys';
import {Location} from '@angular/common';
import {BoardService} from '@data/services/board.service';

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss']
})
export class PdfComponent implements OnInit {

  constructor(private boardService: BoardService,
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
    this.hotkeysService.add(new Hotkey('escape', () => {
      this.returnToBoard();
      return false; // Prevent bubbling
    }));
  }

  generatingPdf = true;
  pdfReady = false;

  board: Board;
  pdfMake;
  pdfDefinition: object;
  compiledPdf;
  failureReason: string;

  images = {};

  cellSpacing = 10;

  @ViewChild('pdfFrame') pdfFrame: ElementRef;

  // Converts a rgb(0,0,0) colour value into hex format.
  private static rgbToHex(rgb) {
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

  ngOnInit() {
    this.boardService.get(this.route.snapshot.paramMap.get('board_id'), 'cells').subscribe(board => {

      this.board = board;

      if (!this.board) { return this.error('The Board could not be loaded.'); }

      try {
        // Collect the images as Base64 and generatePDF() when all images are downloaded and ready.
        this.board.cells.map(cell => {
          // If an image is present and IS NOT an SVG, get it as Base64.
          if (cell.image_url && !cell.image_url.endsWith('.svg')) {
            this.imageBase64Service.getFromURL(cell.image_url).then(image => {
              this.images[cell.id] = {base64: image};
              this.generatePdfIfImagesReady();
            },
            error => {
              console.log(error);
              this.error('We couldn\'t generate your PDF because one of the images in your ' +
                'Board could not be loaded. The error was "' + error.statusText + '" and the affected URL was ' + error.url);
            });

            // If an image is present and IS an SVG, get it as text.
          } else if (cell.image_url && cell.image_url.endsWith('.svg')) {

            this.http.get(cell.image_url, {
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

            },
            error => {
              console.log(error);
              this.error('We couldn\'t generate your PDF because one of the images in your ' +
                'Board could not be loaded. The error was "' + error.statusText + '" and the affected URL was ' + error.url);
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
        let borderColour = cell.border_colour ? cell.border_colour : '#000000';
        if (cell.border_colour?.startsWith('rgb')) {
          borderColour = PdfComponent.rgbToHex(borderColour);
        }

        let backgroundColour = cell.background_colour;
        if (cell.background_colour?.startsWith('rgb')) {
          backgroundColour = PdfComponent.rgbToHex(backgroundColour);
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

  returnToBoard() {
    if (this.board) {
      this.router.navigate(['/', 'boardsets', this.board.board_set_id], {
        queryParams: {board: this.board.uuid}
      }).then();
    } else {
      this.location.back();
    }
  }
}
