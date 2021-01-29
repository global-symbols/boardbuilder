import {Component, OnInit} from '@angular/core';
import {Media} from '@data/models/media.model';
import {MediaService} from '@data/services/media.service';
import {saveAs} from 'file-saver';
import {DialogService} from '@app/services/dialog.service';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {

  media: Media[];
  loading: boolean;

  constructor(
    private service: MediaService,
    private dialogService: DialogService,
  ) { }

  ngOnInit(): void {
    this.loadMedia();
  }

  loadMedia(): void {
    this.loading = true;
    this.service.list().subscribe(
      media => this.media = media,
      error => null,
      () => this.loading = false
    );
  }

  delete(mediaItem: Media) {

    this.dialogService.delete({
      heading: `Delete this Symbol?`,
      content: `The Symbol will be permanently removed from any Boards it\'s used in.`
    }).afterClosed().subscribe(result => {

      if (result) {
        this.service.delete(mediaItem).subscribe(r => {
          // Remove the Media Item from the array of Media.
          this.media = this.media.filter(m => m !== mediaItem);
        });
      }
    });
  }

  get spaceUsed(): number {
    let sum = 0;
    this.media.forEach(a => sum += a.filesize);
    return sum;
  }

  openSymbolCreator(media?: Media) {
    this.dialogService.openSymbolCreator(media).afterClosed().subscribe(mediaItem => {
      // Reload the Media list
      if (mediaItem) { this.loadMedia(); }
    });
  }

  download(media: Media) {
    this.service.getImage(media).subscribe(blob => {
      const extension = blob.type.match(/\/([a-z]+)/)[1];
      saveAs(blob, `image.${extension}`);
    });
  }
}
