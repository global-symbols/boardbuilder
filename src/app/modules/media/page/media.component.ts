import {Component, OnDestroy, OnInit} from '@angular/core';
import {Media} from '@data/models/media.model';
import {MediaService} from '@data/services/media.service';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '@shared/components/confirm-dialog/confirm-dialog.component';
import {ToolbarService} from '@app/services/toolbar.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit, OnDestroy {

  media: Media[];
  loading: boolean;
  private currentDialogRef;

  constructor(private service: MediaService,
              private dialog: MatDialog,
              private toolbarService: ToolbarService,
              private router: Router
  ) { }

  ngOnInit(): void {
    this.loadMedia();

    this.toolbarService.setButtons([{
      text: 'Board Sets',
      icon: 'arrow_back',
      action: () => this.router.navigate(['/', 'boardsets'])
    }]);
  }

  ngOnDestroy(): void {
    // Clear navbar buttons
    this.toolbarService.clearButtons();
  }

  loadMedia(): void {
    this.loading = true;
    this.service.list().subscribe(
      media => this.media = media,
      error => null,
      () => this.loading = false
    );
  }

  delete(mediaItem: any) {
    if (this.currentDialogRef !== undefined) { return; }

    this.currentDialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {heading: 'Delete this Image?', content: 'The image will be permanently removed from any Boards it\'s used in.'}
    });

    this.currentDialogRef.afterClosed().subscribe(result => {

      if (result) {
        this.service.delete(mediaItem).subscribe(r => {
          // Remove the Media Item from the array of Media.
          this.media = this.media.filter(m => m !== mediaItem);
        });
      }

      this.currentDialogRef = undefined;
    });
  }

  get spaceUsed(): number {
    let sum = 0;
    this.media.forEach(a => sum += a.filesize);
    return sum;
  }
}
