import {Component, ElementRef, OnInit, Output, ViewChild, EventEmitter} from '@angular/core';
import {Media} from '@data/models/media.model';
import {MediaService} from '@data/services/media.service';

@Component({
  selector: 'app-media-library',
  templateUrl: './media-library.component.html',
  styleUrls: ['./media-library.component.scss']
})
export class MediaLibraryComponent implements OnInit {

  loadingMedia = false;
  media: Media[];

  uploadingMedia = false;
  uploadingMediaError = false;

  @Output() readonly mediaSelect = new EventEmitter<Media>();

  @ViewChild('fileUpload') fileUpload: ElementRef;

  constructor(private service: MediaService) { }

  ngOnInit(): void {
    // TODO: load media when panel becomes visible
    this.loadMedia();
  }

  loadMedia(): void {
    this.loadingMedia = true;
    this.service.list().subscribe(media => {
      this.loadingMedia = false;
      return this.media = media;
    });
  }

  selectFile() {
    this.uploadingMediaError = false;
    this.fileUpload.nativeElement.click();
  }

  uploadFile() {
    this.uploadingMediaError = false;
    if (this.fileUpload.nativeElement.files.length === 1) {
      this.uploadingMedia = true;

      this.service.add(this.fileUpload.nativeElement.files[0]).subscribe(media => {
        this.media.push(media);
        this.mediaSelect.emit(media);

        // Clear the <input> value and reset uploading status
        this.fileUpload.nativeElement.value = null;
        this.uploadingMedia = false;
      },
      error => {
        this.uploadingMediaError = true;

        // Clear the <input> value and reset uploading status
        this.fileUpload.nativeElement.value = null;
        this.uploadingMedia = false;
      });
    }
  }
}
