import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {Board} from '@data/models/board.model';
import {Cell} from '@data/models/cell.model';
import {DialogService} from '@app/services/dialog.service';
import {Media} from '@data/models/media.model';
import {BoardService} from '@data/services/board.service';

@Component({
  selector: 'app-board-detail',
  templateUrl: './board-detail.component.html',
  styleUrls: ['./board-detail.component.scss']
})
export class BoardDetailComponent implements OnChanges {

  @Input() board: Board;
  @Input() cell: Cell;
  @Output() cellChange = new EventEmitter<Cell>();
  @Output() boardChange = new EventEmitter<number>();

  constructor(
    private dialogService: DialogService,
    private boardService: BoardService
  ) { }

  ngOnChanges() {
  }

  selectCell(cell: Cell) {
    this.cellChange.emit(cell);
  }

  showBoard(linkedBoardId: number) {
    this.boardChange.emit(linkedBoardId);
  }

  selectHeaderImage() {
    this.dialogService.openMediaLibrary({
      sources: ['user_media'],
      allowClear: !!this.board.header_media
    }).afterClosed().subscribe(media => {
      if (media) {
        media.id ? this.setBoardHeaderMedia(media) : this.clearBoardHeaderMedia();
      }
    });
  }

  setBoardHeaderMedia(media: Media) {
    this.board.header_media = media;
    this.board.header_media_id = media.id;
    this.boardService.update(this.board).subscribe();
  }

  clearBoardHeaderMedia() {
    this.board.header_media = null;
    this.board.header_media_id = null;
    this.boardService.update(this.board).subscribe();
  }
}
