import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {fabric} from 'fabric';
import {ImageBase64Service} from '@data/services/image-base64.service';
import {WebFontsService} from '@data/services/web-fonts.service';
import {FontGroup} from '@data/web-safe-fonts';
import {Hotkey, HotkeysService} from '@conflito/angular2-hotkeys';
import {saveAs} from 'file-saver';
import {Media} from '@data/models/media.model';
import {MediaService} from '@data/services/media.service';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {DialogService} from '@app/services/dialog.service';
import {palettes} from '@data/colour-picker-colours';

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

  pickerColours = palettes.regular;

  private defaultColour = 'black';

  @Input() media: Media;

  // private statusSubject = new BehaviorSubject<SymbolCreatorState>(SymbolCreatorState.Loading);
  // public loading$ = this.statusSubject.asObservable();

  status: SymbolCreatorState;
  lastError: string;

  workingCanvas: fabric.Canvas;
  @ViewChild('canvasElement') canvasElement: ElementRef;

  fonts: Array<FontGroup>;

  colours = ['black', 'red', 'blue'];

  selectedElement: fabric.Object | any; // fabric.Object does not contain all properties used in Fabric, notably i-text props.
  selectedElements: Array<fabric.Object | any> = [];

  width = 400;
  height = 400;

  private hotkeys: Array<Hotkey | Hotkey[]>;

  constructor(
    private imageService: ImageBase64Service,
    private mediaService: MediaService,
    private hotkeysService: HotkeysService,
    private fontService: WebFontsService,
    private dialogService: DialogService
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

    // Prevent objects from moving outside the canvas area.
    // Uses getBoundingRect and setPositionByOrigin to cope with object rotation.
    this.workingCanvas.on('object:moving', (event) => {

      const bBox = event.target.getBoundingRect(false, true);
      const canvas = {
        top: 0,
        left: 0,
        height: this.height,
        width: this.width
      };

      // Calculate co-ordinates for left and top that prevent them exceeding min/max limits.
      const newLeft = Math.min( Math.max(bBox.left, canvas.left), canvas.width  - bBox.width);
      const newTop  = Math.min( Math.max(bBox.top,  canvas.top ), canvas.height - bBox.height);

      // Apply the new co-ordinates to the object, relative to its origin.
      event.target.setPositionByOrigin(new fabric.Point(
        newLeft + bBox.width  / 2,
        newTop  + bBox.height / 2
      ), 'center', 'center');
      event.target.setCoords();
    });

    this.workingCanvas.on('object:scaling', (event) => {
      return;
      const object = event.target;

      // console.log(event);

      // If the object is being scaled off the bottom of the canvas...
      if (object.top + (object.height * object.scaleY) > this.height) {
        object.set('scaleX', (this.height - object.top) / object.height);
        object.set('scaleY', (this.height - object.top) / object.height);
      }

      // If the object is being scaled off the right of the canvas...
      if (object.left + (object.width * object.scaleX) > this.width) {
        object.set('scaleX', (this.width - object.left) / object.width);
        object.set('scaleY', (this.width - object.left) / object.width);
      }

      // If the object is being scaled off the left of the canvas...
      if (object.left < 0) {
        // console.log('left is less than 0');
        // object.set('left', 0);
        // object.set('top', 0);
        // object.set('scaleX', (this.width - object.left) / object.width);
        // object.set('scaleX', (this.height - object.left) / object.width);
        // object.set('scaleY', (this.height - object.left) / object.width);
      }

    });

    // Displays the bounding box around each element.
    // this.workingCanvas.on('after:render', () => {
    //   this.workingCanvas.contextContainer.strokeStyle = '#555';
    //
    //   this.workingCanvas.forEachObject((obj) => {
    //     const bound = obj.getBoundingRect();
    //     console.log(bound);
    //
    //     this.workingCanvas.contextContainer.strokeRect(
    //       bound.left + 0.5,
    //       bound.top + 0.5,
    //       bound.width,
    //       bound.height
    //     );
    //   });
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
        return this.editMode();
      });
    });
  }

  editMode(): void {
    this.status = SymbolCreatorState.Editing;
  }

  selectElementFromEvent(event): void {
    if (event.selected.length === 1) {
      this.selectedElement = event.selected[0];
    } else {
      this.selectedElement = null;
    }
    this.selectedElements = event.selected;
    // console.log(this.selectedElement);
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
    this.dialogService.openMediaLibrary().afterClosed().subscribe(media => {
      if (media?.canvas_url) {
        this.addObjectsFromMedia(media);
      } else if (media?.public_url) {
        this.addImage(this.bustCorsCache(media.public_url));
      }
    });
  }

  // Gets the FabricJS Canvas data for the Media item, deserialises it
  // and adds the objects to the current canvas in a group
  addObjectsFromMedia(media: Media): void {
    this.mediaService.getCanvas(media).subscribe(canvas => {
      if (canvas.objects) {
        fabric.util.enlivenObjects(canvas.objects, (objects) => this.addShape(new fabric.Group(objects)), null);
      }
    });
  }

  addImage(imageUrl: string): void {

    this.imageService.getMimeType(imageUrl).subscribe(mimeType => {
      if (mimeType === 'image/svg+xml') {
        // Load the SVG as a collection of objects in the canvas
        fabric.loadSVGFromURL(imageUrl, (objects, options) => {
          // const shape = fabric.util.groupSVGElements(objects, {...options});
          const shape = new fabric.Group(objects, {...options});

          // Set the shape size to fit the canvas.
          let scaleFactor = 1;
          if (shape.height >= shape.width) {
            // Height is longest edge
            scaleFactor = (this.height / 2) / shape.height;
          } else {
            // Width is longest edge
            scaleFactor = (this.width / 2) / shape.width;
          }

          // Scale the shape and move it to the centre of the canvas.
          shape.set({
            scaleX: scaleFactor,
            scaleY: scaleFactor,
            top:  (this.height / 2) - ((shape.height * scaleFactor) / 2),
            left: (this.width / 2) - ((shape.width * scaleFactor) / 2)
          });

          this.addShape(shape);

        }, (element, object) => {
          // The SVG standard states that <path>s should receive a default black fill if no fill is specified.
          // FabricJS doesn't render this default fill, so we add it here when the element is revived.
          if (object.get('type') === 'path' && object.fill === 'transparent' && object.stroke === 'transparent') {
            object.fill = 'black';
          }
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
        }, error => this.errorLoadingImage('Failure loading image.'));
      }
    }, error => this.errorLoadingImage('Failure detecting image type.'));
  }

  errorLoadingImage(reason: string): void {
    this.dialogService.error({
      content: 'We could not load the image.',
      detail: reason
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

  addCross(): void {
    const startPoints = [
      {x: 7, y: 0},
      {x: 50, y: 43},
      {x: 93, y: 0},
      {x: 100, y: 7},
      {x: 57, y: 50},
      {x: 100, y: 93},
      {x: 93, y: 100},
      {x: 50, y: 57},
      {x: 7, y: 100},
      {x: 0, y: 93},
      {x: 43, y: 50},
      {x: 0, y: 7},
    ];

    this.addShape(new fabric.Polygon(startPoints, {
      left: 50,
      top: 50,
      fill: this.defaultColour,
      angle: 0,
      objectCaching: false,
    }));
  }

  addPlus(): void {
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
      angle: 0,
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

    let action: Observable<Media> = null;

    if (this.media) {
      action = this.mediaService.update(this.media, svg, canvas);
    } else {
      action = this.mediaService.add(svg, canvas);
    }

    return action.pipe(tap(
      () => this.status = SymbolCreatorState.SavingError,
      err => {
        this.lastError = err.error.message;
        return this.status = SymbolCreatorState.SavingError;
      })
    );
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

  align(direction: 'horizontal' | 'vertical') {
    const object = this.workingCanvas.getActiveObject();

    if (direction === 'horizontal') {
      this.setProperty('left', (this.workingCanvas.width / 2) - (((object.width + object.strokeWidth) * object.scaleX) / 2));
    } else {
      this.setProperty('top', (this.workingCanvas.height / 2) - (((object.height + object.strokeWidth) * object.scaleY) / 2));
    }

  }



  // Appends a random parameter to a URL, as a way to bust caches that cache the wrong CORS state for an image.
  bustCorsCache(inputUrl: string) {
    const url = new URL(inputUrl);
    url.searchParams.append('bustCorsCache', Math.random().toString(36).substring(7));
    return url.toString();
  }
}
