import {Injectable} from '@angular/core';

import {BoardSet} from '../models/boardset.model';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import * as JSZip from 'jszip';
import {ObzManifest} from '../models/obz-manifest.interface';

@Injectable({
  providedIn: 'root'
})
export class LocalBoardSetService {

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

  addBoardSet(boardSet: BoardSet): Promise<BoardSet> {
    return this.dbService.add(this.storeName, boardSet).then(n => {
      return this.getBoardSet(n);
    });
  }

  getBoardSet(id: number | string): Promise<BoardSet> {
    if (typeof id === 'number') {
      return this.dbService.getByKey(this.storeName, id).then(
        bs => new BoardSet().deserialise(bs)
      );
    } else {
      return this.dbService.getByIndex(this.storeName, 'uuid', id).then(
        bs => new BoardSet().deserialise(bs),
        error => {
          console.log(error);
          return new BoardSet().deserialise(error);
        }
      );
    }
  }

  updateBoardSet(boardSet: any) {
    boardSet.updatedAt = Date.now();
    return this.dbService.update(this.storeName, boardSet);
  }

  delete(boardSet: BoardSet): Promise<boolean> {
    return this.dbService.delete(this.storeName, boardSet.localId).then(r => r, error => {
      console.log(error);
    });
  }

  convertToObz(boardSet: BoardSet): Promise<any> {
    const zip = new JSZip();

    // Prepare the bare OBZ Manifest data
    const manifest: ObzManifest = {
      format: 'open-board-0.1',
      root: 'boards/' + boardSet.boards[0].uuid + '.obf',
      paths: {
        boards: { },
        images: { },
        sounds: { }
      }
    };

    boardSet.boards.forEach(board => {
      const boardFilename = 'boards/' + board.uuid + '.obf';

      // Add the Board OBF file to the ZIP file.
      zip.file(boardFilename, JSON.stringify(board.toObf(), null, 2));

      // Add the Board OBF file path to the OBZ Manifest
      return manifest.paths.boards[board.uuid] = boardFilename;
    });

    // Add the OBZ Manifest file to the ZIP.
    zip.file('manifest.json', JSON.stringify(manifest, null, 2));

    return zip.generateAsync({type: 'blob'});
  }
}
