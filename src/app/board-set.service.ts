import {Injectable} from '@angular/core';

import {BoardSet} from './models/boardset.model';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {Board} from './models/board.model';

@Injectable({
  providedIn: 'root'
})
export class BoardSetService {

  constructor(private dbService: NgxIndexedDBService) { }

  getBoardSets(): Promise<BoardSet[]> {
    return this.dbService.getAll('boardsets').then(result => result.map(bs => new BoardSet().deserialise(bs)).reverse());
  }

  newBoardSet(): Promise<BoardSet> {
    const boardSet = new BoardSet();
    return this.dbService.add('boardsets', boardSet).then(n => this.getBoardSet(n));
  }

  getBoardSet(id: number | string): Promise<BoardSet> {
    if (typeof id === 'number') {
      return this.dbService.getByKey('boardsets', id).then(bs => new BoardSet().deserialise(bs));
    } else {
      return this.dbService.getByIndex('boardsets', 'uuid', id).then(bs => new BoardSet().deserialise(bs));
    }

  }

  getBoard(boardSetId: number, boardIndex: number) {
    return this.getBoardSet(boardSetId).then(bs => new Board().deserialise(bs.boards[boardIndex]));
  }

  updateBoardSet(boardSet: any) {
    return this.dbService.update('boardsets', boardSet);
  }
}
