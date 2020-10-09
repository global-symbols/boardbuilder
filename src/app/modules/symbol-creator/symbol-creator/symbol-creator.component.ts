import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {fabric} from 'fabric';
import {ImageBase64Service} from '@data/services/image-base64.service';
import {WebFontsService} from '@data/services/web-fonts.service';
import {FontGroup} from '@data/web-safe-fonts';
import {Hotkey, HotkeysService} from 'angular2-hotkeys';
import {saveAs} from 'file-saver';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AddSymbolDialogComponent} from '@modules/symbol-creator/add-symbol-dialog/add-symbol-dialog.component';

@Component({
  selector: 'app-symbol-creator',
  templateUrl: './symbol-creator.component.html',
  styleUrls: ['./symbol-creator.component.scss']
})
export class SymbolCreatorComponent implements OnInit, OnDestroy {

  pickerColours =
    ['#B80000', '#DB3E00', '#FCCB00', '#008B02', '#006B76', '#1273DE', '#004DCF', '#5300EB', '#555555', '#000000',
     '#EB9694', '#FAD0C3', '#FEF3BD', '#C1E1C5', '#BEDADC', '#C4DEF6', '#BED3F3', '#D4C4FB', '#AAAAAA', '#FFFFFF'];

  canvas;
  @ViewChild('canvasElement') canvasElement: ElementRef;

  fonts: Array<FontGroup>;

  colours = ['black', 'red', 'blue'];

  selectedElement;
  selectedElements = [];

  private currentDialogRef: MatDialogRef<any>;
  private hotkeys: Array<Hotkey | Hotkey[]>;

  constructor(
    private imageService: ImageBase64Service,
    private hotkeysService: HotkeysService,
    private fontService: WebFontsService,
    private dialog: MatDialog
  ) {
    this.hotkeys = [];
  }

  ngOnInit(): void {
    this.fonts = this.fontService.groupedByCategory();

    this.canvas = new fabric.Canvas('canvas');

    // All objects should snap on rotation
    fabric.Object.prototype.top = 100;
    fabric.Object.prototype.left = 100;
    fabric.Object.prototype.snapAngle = 15;
    fabric.Object.prototype.hasBorders = false;
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerColor = 'rgba(0,106,186, 0.8)';
    fabric.Object.prototype.cornerStrokeColor = 'rgb(0,106,186)';
    fabric.Object.prototype.cornerSize = 8;
    fabric.Object.prototype.rotatingPointOffset = 2;

    fabric.Object.prototype.fill = 'transparent';
    fabric.Object.prototype.stroke = 'transparent';

    this.canvas.selectionColor  = 'rgba(0,106,186, 0.1)';
    this.canvas.selectionBorderColor  = '#006aba';
    this.canvas.selectionDashArray  = [4, 3];

    // Handle object selection/deselection events.
    this.canvas.on('selection:created', event => this.selectElementFromEvent(event));
    this.canvas.on('selection:updated', event => this.selectElementFromEvent(event));
    this.canvas.on('selection:cleared', event => {
      this.selectedElement = null;
      this.selectedElements = [];
    });

    // Keyboard shortcut - delete selected items
    this.hotkeys.push(
      this.hotkeysService.add(new Hotkey(['del', 'backspace'], (event: KeyboardEvent): boolean => {
        this.deleteSelectedItems();
        return false; // Prevent bubbling
      }, undefined, 'Delete Selected Items'))
    );

    this.addSquare();
    this.addText();
  }

  ngOnDestroy(): void {
    // Unassign all keyboard shortcuts
    [].concat(...this.hotkeys).map(hotkey => this.hotkeysService.remove(hotkey));
  }

  selectElementFromEvent(event): void {
    if (event.selected.length === 1) {
      this.selectedElement = event.selected[0];
    } else {
      this.selectedElement = null;
    }
    this.selectedElements = event.selected;
  }

  setProperty(prop, value): void {
    // console.log(`Setting ${prop} to ${value}`);
    this.selectedElement.set(prop, value);
    this.redrawSelectedElement();
  }

  redrawSelectedElement(): void {
    this.selectedElement.set('dirty', true);
    this.renderCanvas();
  }

  renderCanvas(): void {
    this.canvas.renderAll();
  }

  showImageSelectDialog(): void {
    if (this.currentDialogRef !== undefined) { return; }

    this.currentDialogRef = this.dialog.open(AddSymbolDialogComponent, {
      width: '400px'
    });

    this.currentDialogRef.afterClosed().subscribe(selectedImageUrl => {
      if (typeof selectedImageUrl === 'string') {
        this.addImage(selectedImageUrl);
      }

      this.currentDialogRef = undefined;
    });
  }

  addImage(imageUrl: string) {

    this.imageService.getMimeType(imageUrl).subscribe(mimeType => {
      if (mimeType === 'image/svg+xml') {
        // Load SVGs as SVGs

        fabric.loadSVGFromURL(imageUrl, (objects, options) => {
          this.addShape(fabric.util.groupSVGElements(objects, {...options, ...{top: 100, left: 100}}));
        });

      } else {
        // Load all other images as Image DOM elements

        const image = new Image();
        image.onload = () => {
          this.addShape(new fabric.Image(image));
        };

        image.crossOrigin = 'Anonymous';
        image.src = imageUrl;
      }
    });
  }

  toggleFontWeight() {
    const newFontWeight = this.selectedElement.fontWeight === 'normal' ? 'bold' : 'normal';
    this.setProperty('fontWeight', newFontWeight);
  }

  toggleFontStyle() {
    const newFontStyle = this.selectedElement.fontStyle === 'normal' ? 'italic' : 'normal';
    this.setProperty('fontStyle', newFontStyle);
  }

  addText() {
    const text = new fabric.IText('Text', {
      left: 100,
      top: 100,
      fontFamily: 'Arial',
      stroke: 'transparent',
      fill: 'black',
      textAlign: 'center'
    });
    this.canvas.add(text);
    this.canvas.setActiveObject(text);
  }

  addPlus(angle = 0) {
    const startPoints = [
      {x: 45, y: 0},
      {x: 55, y: 0},
      {x: 55, y: 45},
      {x: 100, y: 45},
      {x: 100, y: 55},
      {x: 55, y: 55},
      {x: 55, y: 100},
      {x: 45, y: 100},
      {x: 45, y: 55},
      {x: 0, y: 55},
      {x: 0, y: 45},
      {x: 45, y: 45},
    ];

    this.addShape(new fabric.Polygon(startPoints, {
      left: 50,
      top: 50,
      fill: 'red',
      angle,
      objectCaching: false,
    }));

    // Unused - draws the plus with two crossed, grouped lines.
    // const xBar = new fabric.Line([50, 0, 50, 100], {
    //   top:    100,
    //   left:   100,
    //   strokeWidth: 5,
    //   stroke: 'red',
    //   originY: 'center',
    //   originX: 'center'
    // });
    //
    // const yBar = new fabric.Line([0, 50, 100, 50], {
    //   top:    100,
    //   left:   100,
    //   strokeWidth: 5,
    //   stroke: 'red',
    //   originY: 'center',
    //   originX: 'center'
    // });
    //
    // this.addShape(new fabric.Group([xBar, yBar], {
    //   left: 150,
    //   top: 100
    // }));
  }

  addSquare() {
    this.addShape(new fabric.Rect({
      width: 50,
      height: 50,
      stroke: 'red',
      fill: 'transparent'
    }));
  }

  addTriangle() {
    this.addShape(new fabric.Triangle({
      width: 50,
      height: 50,
      stroke: 'red',
      fill: 'transparent'
    }));
  }

  addLine() {
    this.addShape(new fabric.Line([100, 100, 200, 100], {
      stroke: 'red',
    }));
  }

  addCircle() {
    this.addShape(new fabric.Circle({
      radius: 25,
      stroke: 'red',
      fill:   'transparent'
    }));
  }

  addArrow() {
    const fromx = 0;
    let tox = 75;
    const fromy = 0;
    let toy = 0;

    const angle = Math.atan2(toy - fromy, tox - fromx);

    const headlen = 15;  // arrow head size

// bring the line end back some to account for arrow head.
    tox = tox - (headlen) * Math.cos(angle);
    toy = toy - (headlen) * Math.sin(angle);

// calculate the points.
    const points = [
      {
        x: fromx,  // start point
        y: fromy
      }, {
        x: fromx - (headlen / 4) * Math.cos(angle - Math.PI / 2),
        y: fromy - (headlen / 4) * Math.sin(angle - Math.PI / 2)
      }, {
        x: tox - (headlen / 4) * Math.cos(angle - Math.PI / 2),
        y: toy - (headlen / 4) * Math.sin(angle - Math.PI / 2)
      }, {
        x: tox - (headlen) * Math.cos(angle - Math.PI / 2),
        y: toy - (headlen) * Math.sin(angle - Math.PI / 2)
      }, {
        x: tox + (headlen) * Math.cos(angle),  // tip
        y: toy + (headlen) * Math.sin(angle)
      }, {
        x: tox - (headlen) * Math.cos(angle + Math.PI / 2),
        y: toy - (headlen) * Math.sin(angle + Math.PI / 2)
      }, {
        x: tox - (headlen / 4) * Math.cos(angle + Math.PI / 2),
        y: toy - (headlen / 4) * Math.sin(angle + Math.PI / 2)
      }, {
        x: fromx - (headlen / 4) * Math.cos(angle + Math.PI / 2),
        y: fromy - (headlen / 4) * Math.sin(angle + Math.PI / 2)
      }, {
        x: fromx,
        y: fromy
      }
    ];

    this.addShape(new fabric.Polyline(points, {
      fill: 'red',
      stroke: 'black',
      opacity: 1,
      strokeWidth: 2,
      originX: 'left',
      originY: 'top',
      selectable: true
    }));
  }

  private addShape(shape): void {
    this.canvas.add(shape);
    this.canvas.setActiveObject(shape);
  }

  deleteSelectedItems() {
    this.canvas.getActiveObjects().forEach((obj) => {
      this.canvas.remove(obj);
    });
    this.canvas.discardActiveObject().renderAll();
  }

  savePNG(): void {
    this.canvas.discardActiveObject();
    this.renderCanvas();
    this.canvasElement.nativeElement.toBlob(blob => saveAs(blob, 'My Symbol.png'));
  }

  sendToBack() {
    this.canvas.sendToBack(this.selectedElement);
    // this.redrawSelectedElement();
    this.canvas.discardActiveObject();
    this.renderCanvas();
  }
}
