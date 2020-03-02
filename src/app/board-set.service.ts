import {Injectable} from '@angular/core';

import {BoardSet} from './models/boardset.model';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {Board} from './models/board.model';

@Injectable({
  providedIn: 'root'
})
export class BoardSetService {

  private storeName = 'boardsets';

  constructor(private dbService: NgxIndexedDBService) { }

  getBoardSets(): Promise<BoardSet[]> {
    return this.dbService.getAll(this.storeName).then(result => result.map(bs => new BoardSet().deserialise(bs)).reverse());
  }

  newBoardSet(): Promise<BoardSet> {
    const boardSet = new BoardSet();
    return this.dbService.add(this.storeName, boardSet).then(n => {
      return this.getBoardSet(n);
    });
  }

  getBoardSet(id: number | string): Promise<BoardSet> {
    if (typeof id === 'number') {
      return this.dbService.getByKey(this.storeName, id).then(bs => new BoardSet().deserialise(bs));
    } else {
      return this.dbService.getByIndex(this.storeName, 'uuid', id).then(bs => new BoardSet().deserialise(bs));
    }
  }

  updateBoardSet(boardSet: any) {
    return this.dbService.update(this.storeName, boardSet);
  }

  delete(boardSet: BoardSet): Promise<boolean> {
    return this.dbService.delete(this.storeName, boardSet.localId).then(r => r, error => {
      console.log(error);
    });
  }
}
