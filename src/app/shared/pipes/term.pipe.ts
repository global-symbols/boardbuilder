import {Pipe, PipeTransform} from '@angular/core';
import {BoardSet} from '@data/models/boardset.model';

export type Term = 'board' | 'boards' | 'boardSet' | 'boardSets';

// The landing page, which lists both books and board sets; back buttons to it use this name (D35).
export const LANDING_PAGE_NAME = $localize`:Books and Board Sets heading:My Books & Board Sets`;

// Visible wording for board sets and books. A book calls its boards pages.
const TERMS: { [key in Term]: { boardSet: string, book: string } } = {
  board: {
    boardSet: $localize`:board|A board in a board set:Board`,
    book: $localize`:page|A page in a book:Page`
  },
  boards: {
    boardSet: $localize`:boards|Boards in a board set:Boards`,
    book: $localize`:pages|Pages in a book:Pages`
  },
  boardSet: {
    boardSet: $localize`:board set|Board Set:Board Set`,
    book: $localize`:book|A communication book:Book`
  },
  boardSets: {
    boardSet: $localize`:board sets|Board Sets:Board Sets`,
    book: $localize`:books|Communication books:Books`
  }
};

export function term(name: Term, boardSet: BoardSet | null | undefined): string {
  return TERMS[name][boardSet?.isBook ? 'book' : 'boardSet'];
}

// {{ 'board' | term:boardSet }} → "Board", or "Page" in a book.
@Pipe({ name: 'term' })
export class TermPipe implements PipeTransform {
  transform(name: Term, boardSet: BoardSet | null | undefined): string {
    return term(name, boardSet);
  }
}
