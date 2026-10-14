import {ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, tick, waitForAsync} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ActivatedRoute, convertToParamMap, Router} from '@angular/router';
import {of} from 'rxjs';

import {BOOK_EXPORT_POLL_MS, BookPdfComponent} from './book-pdf.component';
import {BoardService} from '@data/services/board.service';
import {BoardSetService} from '@data/services/board-set.service';
import {TemplateService} from '@data/services/template.service';
import {GlobalSymbolsService} from '@data/services/global-symbols.service';
import {ToolbarService} from '@app/services/toolbar.service';
import {BoardSet} from '@data/models/boardset.model';
import {Template} from '@data/models/template.model';
import {PageSize} from '@data/models/page-size.model';
import {BypassSanitiserPipe} from '@shared/pipes/bypass-sanitiser.pipe';

describe('BookPdfComponent', () => {
  let fixture: ComponentFixture<BookPdfComponent>;
  let component: BookPdfComponent;
  let boardService: jasmine.SpyObj<BoardService>;
  let boardSetService: jasmine.SpyObj<BoardSetService>;

  const book = () => new BoardSet().deserialise({
    id: 1, name: 'Ali', kind: 'book', book_columns: 3, book_rows: 4,
    boards: [
      { id: 11, name: 'Page 2', index: 1, role: 'page', rows: 4, columns: 3, cells: [] },
      { id: 10, name: 'Page 1', index: 0, role: 'page', rows: 4, columns: 3, cells: [] },
      { id: 99, name: 'Core Words', role: 'back_page', back_page_type: 'core_words', rows: 4, columns: 3, cells: [] }
    ] as any
  });

  function create(params: { [key: string]: string }, query: { [key: string]: string } = {}) {
    TestBed.overrideProvider(ActivatedRoute, { useValue: {
      snapshot: { paramMap: convertToParamMap(params), queryParamMap: convertToParamMap(query) }
    } });
    fixture = TestBed.createComponent(BookPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  const lastPreview = (): { boardId: number, template: Template } => {
    const [boardId, template] = boardService.pdfBlob.calls.mostRecent().args;
    return { boardId: boardId as number, template };
  };

  beforeEach(waitForAsync(() => {
    boardService = jasmine.createSpyObj('BoardService', ['pdfBlob']);
    boardService.pdfBlob.and.returnValue(Promise.resolve(new Blob(['%PDF'], { type: 'application/pdf' })));
    boardSetService = jasmine.createSpyObj('BoardSetService', ['get', 'startBookPdfExport', 'bookPdfExport', 'downloadBookPdfExport']);
    boardSetService.get.and.returnValue(of(book()));

    TestBed.configureTestingModule({
      declarations: [ BookPdfComponent, BypassSanitiserPipe ],
      providers: [
        { provide: BoardService, useValue: boardService },
        { provide: BoardSetService, useValue: boardSetService },
        { provide: TemplateService, useValue: { pageSizes: () => of([new PageSize().deserialise({ name: 'A4', x: 595, y: 842 })]) } },
        { provide: GlobalSymbolsService, useValue: { getSymbolSets: () => of([]) } },
        { provide: ToolbarService, useValue: { setButtons: () => {} } },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
        { provide: ActivatedRoute, useValue: {} }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();
  }));

  describe('page mode', () => {
    it('previews the page with this print\'s tab row and back page, using board-set defaults', () => {
      create({ id: '1', board_id: '11' }, { tabRow: '3', includeBackPage: 'true' });

      const { boardId, template } = lastPreview();
      expect(boardId).toBe(11);
      expect(template.tabRow).toBe(3);
      expect(template.includeBackPage).toBeTrue();
      expect(template.pageSize.name).toBe('A4');
      expect([template.cellSpacing, template.cellPadding, template.showHeader]).toEqual([10, 10, false]);
      expect(fixture.nativeElement.textContent).toContain('Tab position for this print only: row');
      expect(fixture.nativeElement.querySelector('.download-page')).toBeTruthy();
      expect(fixture.nativeElement.querySelector('.generate-book')).toBeNull();
    });

    it('has no board-set "Enable tabs" option', () => {
      create({ id: '1', board_id: '10' });

      expect(fixture.nativeElement.textContent).not.toContain('Enable tabs');
    });
  });

  describe('book mode', () => {
    it('previews page 1 only, with no tab override', () => {
      create({ id: '1' });

      const { boardId, template } = lastPreview();
      expect(boardId).toBe(10);
      expect(template.tabRow).toBeUndefined();
      expect(template.includeBackPage).toBeUndefined();
      expect(fixture.nativeElement.querySelector('.generate-book')).toBeTruthy();
    });

    it('generates in the background, shows a spinner while polling, then a download link', fakeAsync(() => {
      create({ id: '1' });
      boardSetService.startBookPdfExport.and.returnValue(of({ id: 5, status: 'queued' }));
      boardSetService.bookPdfExport.and.returnValues(of({ id: 5, status: 'running' }), of({ id: 5, status: 'done' }));

      component.generateBook();
      fixture.detectChanges();
      expect(boardSetService.startBookPdfExport).toHaveBeenCalledWith(component.book, component.template);
      expect(fixture.nativeElement.querySelector('.export-progress')).toBeTruthy();

      tick(BOOK_EXPORT_POLL_MS);
      fixture.detectChanges();
      expect(component.generating).toBeTrue();

      tick(BOOK_EXPORT_POLL_MS);
      fixture.detectChanges();
      expect(component.bookReady).toBeTrue();
      expect(fixture.nativeElement.querySelector('.export-progress')).toBeNull();
      expect(fixture.nativeElement.querySelector('.download-link')).toBeTruthy();
      expect(boardSetService.bookPdfExport).toHaveBeenCalledTimes(2);
      discardPeriodicTasks();
    }));

    it('downloads the finished book once', fakeAsync(() => {
      create({ id: '1' });
      component.bookExport = { id: 5, status: 'done' };
      boardSetService.downloadBookPdfExport.and.returnValue(of(new Blob(['%PDF'])));

      component.downloadBook();
      flush();

      expect(boardSetService.downloadBookPdfExport).toHaveBeenCalledWith(component.book, 5);
      expect(component.bookExport).toBeNull();
    }));

    it('changing a setting drops the generated book and refreshes the preview', () => {
      create({ id: '1' });
      component.bookExport = { id: 5, status: 'done' };
      const previews = boardService.pdfBlob.calls.count();

      component.template.cellSpacing = 20;
      component.onSettingChanged();

      expect(component.bookExport).toBeNull();
      expect(boardService.pdfBlob.calls.count()).toBe(previews + 1);
    });

    it('explains a failed book, e.g. when the layout does not fit', fakeAsync(() => {
      create({ id: '1' });
      boardSetService.startBookPdfExport.and.returnValue(of({ id: 5, status: 'queued' }));
      boardSetService.bookPdfExport.and.returnValue(of({ id: 5, status: 'failed', error: { category: 'insufficient_cell_height' } }));

      component.generateBook();
      tick(BOOK_EXPORT_POLL_MS);
      fixture.detectChanges();

      expect(component.generating).toBeFalse();
      expect(fixture.nativeElement.querySelector('.export-error').textContent).toContain('can\'t fit');
      discardPeriodicTasks();
    }));
  });
});
