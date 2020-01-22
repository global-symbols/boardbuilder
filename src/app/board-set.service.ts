import {Injectable} from '@angular/core';

import {BoardSet} from './models/boardset.model';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {Board} from './models/board.model';

@Injectable({
  providedIn: 'root'
})
export class BoardSetService {

  constructor(private dbService: NgxIndexedDBService) { }

  getBoardSets(): Promise<unknown[]> {
    return this.dbService.getAll('boardsets');
  }

  newBoardSet(): Promise<number> {
    return this.dbService.add('boardsets', new BoardSet());
  }

  getBoardSet(id: number): Promise<any> {
    return this.dbService.getByKey('boardsets', id).then(bs => new BoardSet().deserialise(bs));
  }

  getBoard(boardSetId: number, boardIndex: number) {
    return this.getBoardSet(boardSetId).then(bs => new Board().deserialise(bs.boards[boardIndex]));
  }

  updateBoardSet(boardSet: any) {
    return this.dbService.update('boardsets', boardSet);
  }
}
