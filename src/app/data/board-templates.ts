import {BoardTemplate} from './models/board-template.model';
import {Board} from '@data/models/board.model';

export const boardTemplates: Array<BoardTemplate> = [
  new BoardTemplate().deserialise({
    board: new Board().deserialise({
      columns: 2,
      rows: 3,
      captions_position: 'right',
    })
  }),
  new BoardTemplate().deserialise({
    board: new Board().deserialise({
      columns: 4,
      rows: 3,
      captions_position: 'below',
    })
  }),
  new BoardTemplate().deserialise({
    board: new Board().deserialise({
      columns: 1,
      rows: 4,
      captions_position: 'right',
    })
  }),
  new BoardTemplate().deserialise({
    board: new Board().deserialise({
      columns: 3,
      rows: 4,
      captions_position: 'below',
    })
  }),
  ];
