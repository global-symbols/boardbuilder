import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {fabric} from 'fabric';
import {ImageBase64Service} from '@data/services/image-base64.service';
import {WebFontsService} from '@data/services/web-fonts.service';
import {FontGroup} from '@data/web-safe-fonts';
import {Hotkey, HotkeysService} from 'angular2-hotkeys';
import {saveAs} from 'file-saver';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AddSymbolDialogComponent} from '@shared/components/add-symbol-dialog/add-symbol-dialog.component';
import {Media} from '@data/models/media.model';
import {MediaService} from '@data/services/media.service';
import {Observable} from 'rxjs';

export enum SymbolCreatorState {
  Loading = 'Loading',
  Editing = 'Editing',
  Saving = 'Saving',
  SavingError = 'SavingError'
}

@Component({
  selector: 'app-symbol-creator',
  templateUrl: './symbol-creator.component.html',
  styleUrls: ['./symbol-creator.component.scss']
})
export class SymbolCreatorComponent implements OnInit, OnDestroy {

  pickerColours =
    ['#B80000', '#DB3E00', '#FCCB00', '#008B02', '#006B76', '#1273DE', '#004DCF', '#5300EB', '#555555', '#000000',
     '#EB9694', '#FAD0C3', '#FEF3BD', '#C1E1C5', '#BEDADC', '#C4DEF6', '#BED3F3', '#D4C4FB', '#AAAAAA', '#FFFFFF'];

  private defaultColour = 'black';

  @Input() media: Media;

  // private statusSubject = new BehaviorSubject<SymbolCreatorState>(SymbolCreatorState.Loading);
  // public loading$ = this.statusSubject.asObservable();

  status: SymbolCreatorState;

  workingCanvas: fabric.Canvas;
  @ViewChild('canvasElement') canvasElement: ElementRef;

  fonts: Array<FontGroup>;

  colours = ['black', 'red', 'blue'];

  selectedElement;
  selectedElements = [];

  width = 400;
  height = 400;

  private currentDialogRef: MatDialogRef<any>;
  private hotkeys: Array<Hotkey | Hotkey[]>;

  constructor(
    private imageService: ImageBase64Service,
    private mediaService: MediaService,
    private hotkeysService: HotkeysService,
    private fontService: WebFontsService,
    private dialog: MatDialog
  ) {
    this.hotkeys = [];
  }

  ngOnInit(): void {
    this.fonts = this.fontService.groupedByCategory();

    this.workingCanvas = new fabric.Canvas('canvas');

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

    this.workingCanvas.selectionColor  = 'rgba(0,106,186, 0.1)';
    this.workingCanvas.selectionBorderColor  = '#006aba';
    this.workingCanvas.selectionDashArray  = [4, 3];

    this.workingCanvas.setDimensions({width: this.width, height: this.height});

    // Handle object selection/deselection events.
    this.workingCanvas.on('selection:created', event => this.selectElementFromEvent(event));
    this.workingCanvas.on('selection:updated', event => this.selectElementFromEvent(event));
    this.workingCanvas.on('selection:cleared', event => {
      this.selectedElement = null;
      this.selectedElements = [];
    });

    // Prevent objects from being moved outside the canvas area
    this.workingCanvas.on('object:moving', (event) => {
      const object = event.target;
      // console.log(event);
      const top = object.top;
      const bottom = (top + object.height) * object.scaleY;
      const height = object.height * object.scaleY;
      const left = object.left;
      const right = (left + object.width) * object.scaleX;
      const width = object.width * object.scaleY;

      const topBound = 0;
      const bottomBound = this.height;
      const leftBound = 0;
      const rightBound = this.width;

      // capping logic here
      object.set('left', Math.min(Math.max(left, leftBound), rightBound - width));
      object.set('top', Math.min(Math.max(top, topBound), bottomBound - height));
    });

    // this.workingCanvas.on('object:scaling', (event) => {
    //   const object = event.target;
    //   console.log(event);
    //
    //   if (object.top + (object.height * object.scaleY) > this.height) {
    //     object.set('scaleY', (450 - object.top) / object.height);
    //   }
    //
    //   if (object.left + (object.width * object.scaleX) > this.width) {
    //     object.set('scaleX', (450 - object.left) / object.width);
    //   }
    //
    // });

    if (this.media) {
      this.loadCanvasFromMedia();
    } else {
      this.status = SymbolCreatorState.Editing;
    }

    // Keyboard shortcut - select all items
    this.hotkeys.push(
      this.hotkeysService.add(new Hotkey(['ctrl+a'], (event: KeyboardEvent): boolean => {
        this.selectAll();
        return false; // Prevent bubbling
      }, undefined, 'Select All Items'))
    );

    // Keyboard shortcut - duplicate selected items
    this.hotkeys.push(
      this.hotkeysService.add(new Hotkey(['ctrl+d'], (event: KeyboardEvent): boolean => {
        this.duplicate();
        return false; // Prevent bubbling
      }, undefined, 'Duplicate Selected Items'))
    );

    // Keyboard shortcut - delete selected items
    this.hotkeys.push(
      this.hotkeysService.add(new Hotkey(['del', 'backspace'], (event: KeyboardEvent): boolean => {
        this.deleteSelectedItems();
        return false; // Prevent bubbling
      }, undefined, 'Delete Selected Items'))
    );

    // this.addSquare();
    // this.addText();
  }

  ngOnDestroy(): void {
    // Unassign all keyboard shortcuts
    [].concat(...this.hotkeys).map(hotkey => this.hotkeysService.remove(hotkey));
  }

  loadCanvasFromMedia(): void {
    this.mediaService.getCanvas(this.media).subscribe(canvas => {
      this.workingCanvas.loadFromJSON(canvas, () => {
        return this.status = SymbolCreatorState.Editing;
      });
    });
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
    this.workingCanvas.renderAll();
  }

  showImageSelectDialog(): void {
    if (this.currentDialogRef !== undefined) { return; }

    this.currentDialogRef = this.dialog.open(AddSymbolDialogComponent, {
      width: '400px'
    });

    this.currentDialogRef.afterClosed().subscribe(media => {
      if (media?.canvas_url) {
        this.addObjectsFromMedia(media);
      } else if (media?.public_url) {
        this.addImage(media.public_url);
      }

      this.currentDialogRef = undefined;
    });
  }

  // Gets the FabricJS Canvas data for the Media item, deserialises it
  // and adds the objects to the current canvas in a group
  addObjectsFromMedia(media: Media): void {
    this.mediaService.getCanvas(media).subscribe(canvas => {
      if (canvas.objects) {
        fabric.util.enlivenObjects(canvas.objects, (objects) => this.addShape(new fabric.Group(objects)));
      }
    });
  }

  addImage(imageUrl: string): void {

    this.imageService.getMimeType(imageUrl).subscribe(mimeType => {
      if (mimeType === 'image/svg+xml') {
        // Load SVGs as a collection of objects in the canvas
        fabric.loadSVGFromURL(imageUrl, (objects, options) => {
          this.addShape(fabric.util.groupSVGElements(objects, {...options, ...{top: 0, left: 0}}));
        });

      } else {
        // Load all other images as Image DOM elements
        this.imageService.getFromURL(imageUrl).then(base64 => {

          const image = new Image();
          image.onload = () => {

            const options = {
              scaleX: 1,
              scaleY: 1
            };

            // If the image is square or taller than it is wide...
            if (image.naturalHeight >= image.naturalWidth) {
              // Shrink it to fit 50% of the canvas height
              options.scaleY = (this.height / 2) / image.naturalHeight;
              options.scaleX = (options.scaleY);

            } else {
              // Otherwise, shrink it to fit 50% of the canvas width
              options.scaleX = (this.width / 2) / image.naturalWidth;
              options.scaleY = (options.scaleX);
            }

            this.addShape(new fabric.Image(image, options));
          };
          image.src = base64.toString();
        });
      }
    });
  }

  toggleFontWeight(): void {
    const newFontWeight = this.selectedElement.fontWeight === 'normal' ? 'bold' : 'normal';
    this.setProperty('fontWeight', newFontWeight);
  }

  toggleFontStyle(): void {
    const newFontStyle = this.selectedElement.fontStyle === 'normal' ? 'italic' : 'normal';
    this.setProperty('fontStyle', newFontStyle);
  }

  addText(): void {
    const text = new fabric.IText('Text', {
      left: 100,
      top: 100,
      fontFamily: 'Arial',
      stroke: 'transparent',
      fill: this.defaultColour,
      textAlign: 'center'
    });
    this.workingCanvas.add(text);
    this.workingCanvas.setActiveObject(text);
  }

  addPlus(angle = 0): void {
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
      fill: this.defaultColour,
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

  addSquare(): void {
    this.addShape(new fabric.Rect({
      width: 50,
      height: 50,
      stroke: this.defaultColour,
      fill: 'transparent'
    }));
  }

  addTriangle(): void {
    this.addShape(new fabric.Triangle({
      width: 50,
      height: 50,
      stroke: this.defaultColour,
      fill: 'transparent'
    }));
  }

  addLine(): void {
    this.addShape(new fabric.Line([100, 100, 200, 100], {
      stroke: this.defaultColour,
    }));
  }

  addCircle(): void {
    this.addShape(new fabric.Circle({
      radius: 25,
      stroke: this.defaultColour,
      fill:   'transparent'
    }));
  }

  addArrow(): void {
    const fromx = 100;
    let tox = 175;
    const fromy = 100;
    let toy = 100;

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
      fill: this.defaultColour,
      opacity: 1,
      strokeWidth: 2,
      originX: 'left',
      originY: 'top',
      selectable: true
    }));
  }

  private addShape(shape): void {
    this.workingCanvas.add(shape);
    this.workingCanvas.setActiveObject(shape);
  }

  deleteSelectedItems(): void {
    this.workingCanvas.getActiveObjects().forEach((obj) => {
      this.workingCanvas.remove(obj);
    });
    this.workingCanvas.discardActiveObject().renderAll();
  }

  savePNG(): void {
    this.workingCanvas.discardActiveObject();
    this.renderCanvas();
    this.canvasElement.nativeElement.toBlob(blob => saveAs(blob, 'My Symbol.png'));
  }

  saveSVG(): void {
    this.workingCanvas.discardActiveObject();
    this.renderCanvas();
    saveAs(this.getSVGBlob(), 'My Symbol.svg');
  }

  private getSVGBlob(): Blob {
    return new Blob([this.workingCanvas.toSVG()], {type: 'image/svg+xml'});
  }

  private getSerialisedCanvas(): string {
    return JSON.stringify(this.workingCanvas);
  }

  private getSerialisedCanvasBlob(): Blob {
    return new Blob([this.getSerialisedCanvas()], {type: 'application/json'});
  }

  selectAll(): void {
    this.workingCanvas.discardActiveObject();
    this.workingCanvas.setActiveObject(new fabric.ActiveSelection(this.workingCanvas.getObjects(), {
      canvas: this.workingCanvas,
    }));
    this.renderCanvas();
  }

  save(): Observable<Media> {
    this.status = SymbolCreatorState.Saving;

    const svg = this.getSVGBlob();
    const canvas = this.getSerialisedCanvasBlob();

    if (this.media) {
      return this.mediaService.update(this.media, svg, canvas);
    } else {
      return this.mediaService.add(svg, canvas);
    }
  }

  sendToBack(): void {
    this.workingCanvas.sendToBack(this.selectedElement);
    this.workingCanvas.discardActiveObject();
    this.renderCanvas();
  }

  flip(direction: 'horizontal' | 'vertical'): void {
    direction === 'horizontal' ?
      this.setProperty('flipX', !this.selectedElement.flipX) :
      this.setProperty('flipY', !this.selectedElement.flipY);
  }

  duplicate(): void {
    if (this.selectedElements.length === 0) { return; }

    // We have to discard the selection, because this causes the top/left attributes
    // of the first object to be set relative to the selection centre.
    const objectsToClone = (this.selectedElements);
    this.workingCanvas.discardActiveObject();

    const clones = [];

    objectsToClone.forEach(object => {
      object.clone(clone => {
        clone.canvas = this.workingCanvas;
        clone.set({
          left: object.left + 10,
          top: object.top + 10,
          evented: true
        });
        clones.push(clone);
        this.workingCanvas.add(clone);

        // If all clones have been made, select them on the canvas.
        if (clones.length === objectsToClone.length) {
          this.workingCanvas.setActiveObject(new fabric.ActiveSelection(clones, {
            canvas: this.workingCanvas,
          }));
          this.renderCanvas();
        }
      });
    });
  }
}
