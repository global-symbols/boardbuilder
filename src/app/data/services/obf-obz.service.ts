import {Injectable} from '@angular/core';
import {Board} from '@data/models/board.model';
import * as JSZip from 'jszip';
import {BoardSet} from '@data/models/boardset.model';
import {MediaService} from '@data/services/media.service';
import {Observable} from 'rxjs';
import {BoardSetService} from '@data/services/board-set.service';
import {BoardService} from '@data/services/board.service';
import {Obf} from '@data/models/obf.interface';
import {$localize} from '@angular/localize/init';

interface UploadedImageMap {
  originalId: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class ObfObzService {

  constructor(private mediaService: MediaService,
              private boardSetService: BoardSetService,
              private boardService: BoardService) { }

  // Parses an OBF object to a Board. Does not upload embedded images.
  public parseObf(obf: Obf, boardSet?: BoardSet): Board {
    const board = new Board();
    board.fromObf(obf);
    if (boardSet) { board.board_set_id = boardSet.id; }
    return board;
  }

  // Parses an OBZ file to a BoardSet containing Boards. Does not upload embedded images.
  public parseObz(file): BoardSet {

    const boardSet = new BoardSet();

    // Try to open the zip file
    JSZip.loadAsync(file).then(zip => {

      // Check the manifest file exists
      if (!zip.file('manifest.json')) {
        throw new Error($localize`:obz upload error no manifest:it does not contain a manifest.json file.`);
      }

      // Try to open the manifest file
      zip.file('manifest.json').async('string').then(data => {

        const manifest: any = JSON.parse(data);

        // Create a new BoardSet using the OBZ filename as the title
        boardSet.title = file.name;
        boardSet.boards = [];

        // From the manifest, get the path of each OBF file.
        // The list of OBF files is stored as an object {}, so we have to use Object.entries
        Object.entries(manifest.paths.boards).forEach((board) => {

          // The key is the ID of the OBF, used for referencing when linking Boards.
          const obfId = board[0];
          // The value is the OBF path and filename within the zip file.
          const obfFilename = board[1].toString();

          // Check the OBF file exists within the zip.
          if (!zip.file(obfFilename)) {
            throw new Error($localize`:obz upload error file missing:${obfFilename} is missing.`);
          }

          // Access the OBF file, unpack it to a Board and save it into the BoardSet.
          zip.file(obfFilename).async('string').then(obf => {
            // Prepare a new Board, build it from the OBF and push it to the BoardSet.
            boardSet.boards.push(this.parseObf(JSON.parse(obf)));
          });
        });

      }, error => {throw new Error($localize`:obz upload error bad manifest:the manifest.json file could not be read.`); });

    }, error => {throw new Error($localize`:obz upload error corrupt zip:it is corrupted (could not read ZIP).`); });

    return boardSet;
  }

  // Uploads a BoardSet from an OBZ file, including embedded images.
  public uploadObz(file): Observable<BoardSet> {
    const boardSet = this.parseObz(file);
    return this.boardSetService.add(boardSet);
  }
}
