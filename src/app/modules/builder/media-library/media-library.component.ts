import {Component, ElementRef, OnInit, Output, ViewChild, EventEmitter} from '@angular/core';
import {Media} from '@data/models/media.model';
import {MediaService} from '@data/services/media.service';


export enum UploadStatus {
  Idle = 'Idle',
  Uploading = 'Uploading',
  Error = 'Error'
}

@Component({
  selector: 'app-media-library',
  templateUrl: './media-library.component.html',
  styleUrls: ['./media-library.component.scss']
})
export class MediaLibraryComponent implements OnInit {

  loadingMedia = false;
  media: Media[];

  uploadStatus: UploadStatus;

  dropzoneActive = false;

  allowedTypes = ['image/svg+xml', 'image/jpeg', 'image/gif', 'image/png'];

  @Output() readonly mediaSelect = new EventEmitter<Media>();

  @ViewChild('fileUpload') fileUpload: ElementRef;

  constructor(private service: MediaService) { }

  ngOnInit(): void {
    // TODO: lazy-load media when panel becomes visible
    this.loadMedia();
    this.uploadStatus = UploadStatus.Idle;
  }

  loadMedia(): void {
    this.loadingMedia = true;
    this.service.list().subscribe(media => {
      this.loadingMedia = false;
      return this.media = media;
    });
  }

  openFileSelector() {
    this.uploadStatus = UploadStatus.Idle;
    this.fileUpload.nativeElement.click();
  }

  selectFile() {
    if (this.fileUpload.nativeElement.files.length === 1) {
      this.uploadFile(this.fileUpload.nativeElement.files[0]);
    }
  }

  dropFile($event: DragEvent) {
    this.allowDragDrop($event);
    const files = $event.dataTransfer.files;
    if (files.length === 1) { this.uploadFile(files[0]); }
  }

  uploadFile(file: File) {
    if (this.allowedTypes.includes(file.type)) {
      this.uploadStatus = UploadStatus.Uploading;

      this.service.add(file).subscribe(media => {
          this.media.push(media);
          this.mediaSelect.emit(media);

          // Clear the <input> value and reset uploading status
          this.fileUpload.nativeElement.value = null;
          this.uploadStatus = UploadStatus.Idle;
        },
        error => {
          // Clear the <input> value and reset uploading status
          this.fileUpload.nativeElement.value = null;
          this.uploadStatus = UploadStatus.Error;
        });
    } else {
      this.uploadStatus = UploadStatus.Error;
    }
  }

  allowDragDrop($event: DragEvent) {
    $event.preventDefault();
    $event.stopPropagation();
  }
}
