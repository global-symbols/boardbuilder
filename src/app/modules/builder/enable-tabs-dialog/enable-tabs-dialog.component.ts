import {Component, Directive, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CDK_DRAG_CONFIG, CDK_DROP_LIST, CdkDragDrop, CdkDragEnd, CdkDragMove, moveItemInArray} from '@angular/cdk/drag-drop';
import {BoardSet} from '@data/models/boardset.model';
import {BoardSetService} from '@data/services/board-set.service';
import {DialogService} from '@app/services/dialog.service';
import {Media} from '@data/models/media.model';

interface BoardChip {
  id: number;
  name: string;
}

interface TabDraft {
  clientKey: string;
  id: number | null;
  label: string;
  colour: string;
  image_url: string;
  boardIds: number[];
}

const TAB_COLOURS = ['#4472C4', '#ED7D31', '#70AD47', '#FFC000', '#5B9BD5', '#C45911', '#7030A0'];

// Boards inside a tab must not register with the tab reorder list, or dragging a board reorders the tab.
@Directive({
  selector: '[appFreeDrag]',
  providers: [{ provide: CDK_DROP_LIST, useValue: null }]
})
export class FreeDragDirective {}

@Component({
  selector: 'app-enable-tabs-dialog',
  templateUrl: './enable-tabs-dialog.component.html',
  styleUrls: ['./enable-tabs-dialog.component.scss'],
  providers: [{ provide: CDK_DRAG_CONFIG, useValue: { zIndex: 10000 } }]
})
export class EnableTabsDialogComponent {
  enabled = false;
  edge: 'top' | 'bottom' | 'left' | 'right';
  boards: BoardChip[] = [];
  tabs: TabDraft[] = [];
  selected: { [boardId: number]: boolean } = {};
  collapsed: { [clientKey: string]: boolean } = {};
  hoverKey: string = null;
  saving = false;
  error: string;
  private nextKey = 1;

  constructor(
    public dialogRef: MatDialogRef<EnableTabsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public boardSet: BoardSet,
    private boardSetService: BoardSetService,
    private dialogService: DialogService
  ) {
    this.enabled = boardSet.catalogue_tabs === true;
    this.edge = boardSet.tab_edge || 'right';
    this.boards = (boardSet.boards || [])
      .filter(board => !!board.id)
      .slice()
      .sort((a, b) => (a.index || 0) - (b.index || 0) || a.id - b.id)
      .map(board => ({ id: board.id, name: board.name }));
    this.tabs = (boardSet.tabs || [])
      .slice()
      .sort((a, b) => (a.position || 0) - (b.position || 0) || a.id - b.id)
      .map(tab => ({
        clientKey: 'tab-' + tab.id,
        id: tab.id,
        label: tab.label || '',
        colour: tab.colour || '#4472C4',
        image_url: tab.image_url || '',
        boardIds: (tab.board_ids || []).filter(id => this.boards.some(board => board.id === id))
      }));
  }

  get selectedCount(): number {
    return this.boards.filter(board => this.selected[board.id] && !this.tabForBoard(board.id)).length;
  }

  boardName(id: number): string {
    const board = this.boards.find(item => item.id === id);
    return board ? board.name : '';
  }

  tabForBoard(boardId: number): TabDraft {
    return this.tabs.find(tab => tab.boardIds.indexOf(boardId) !== -1);
  }

  toggleSelected(boardId: number, checked: boolean) {
    if (this.tabForBoard(boardId)) { return; }
    this.selected = { ...this.selected, [boardId]: checked };
  }

  addTab() {
    const number = this.tabs.length + 1;
    this.tabs = this.tabs.concat([{
      clientKey: 'new-' + (this.nextKey++),
      id: null,
      label: 'Tab ' + number,
      colour: TAB_COLOURS[(number - 1) % TAB_COLOURS.length],
      image_url: '',
      boardIds: []
    }]);
  }

  deleteTab(tab: TabDraft) {
    this.tabs = this.tabs.filter(item => item !== tab);
  }

  isCollapsed(tab: TabDraft): boolean {
    return !!this.collapsed[tab.clientKey];
  }

  toggleCollapsed(tab: TabDraft) {
    this.collapsed = { ...this.collapsed, [tab.clientKey]: !this.isCollapsed(tab) };
  }

  dropTab(event: CdkDragDrop<TabDraft[]>) {
    if (!event.item.element.nativeElement.classList.contains('tab-card')) { return; }
    moveItemInArray(this.tabs, event.previousIndex, event.currentIndex);
    this.tabs = this.tabs.slice();
  }

  assignBoards(boardIds: number[], tab: TabDraft) {
    const ids = boardIds.filter(id => this.boards.some(board => board.id === id));
    if (!ids.length) { return; }
    this.tabs.forEach(item => {
      item.boardIds = item.boardIds.filter(id => ids.indexOf(id) === -1);
    });
    ids.forEach(id => {
      if (tab.boardIds.indexOf(id) === -1) { tab.boardIds.push(id); }
    });
    tab.boardIds = tab.boardIds.slice();
  }

  unassignBoards(boardIds: number[]) {
    this.tabs.forEach(tab => {
      tab.boardIds = tab.boardIds.filter(id => boardIds.indexOf(id) === -1);
    });
  }

  addSelected(tab: TabDraft) {
    const ids = this.boards
      .filter(board => this.selected[board.id] && !this.tabForBoard(board.id))
      .map(board => board.id);
    this.assignBoards(ids, tab);
    this.selected = {};
  }

  removeBoard(tab: TabDraft, boardId: number) {
    tab.boardIds = tab.boardIds.filter(id => id !== boardId);
  }

  onBoardDragMoved(event: CdkDragMove) {
    this.hoverKey = this.tabKeyAt(event.pointerPosition, event.source.element.nativeElement);
  }

  onBoardDragEnded(event: CdkDragEnd) {
    const boardId = event.source.data as number;
    const dragged = event.source.element.nativeElement;
    const tabKey = this.tabKeyAt(event.dropPoint, dragged);
    const fromBoardList = !!event.source.element.nativeElement.closest('.board-row');
    if (fromBoardList && this.tabForBoard(boardId)) {
      this.hoverKey = null;
      event.source.reset();
      return;
    }
    const ids = (this.selected[boardId]
      ? this.boards.filter(board => this.selected[board.id] && !this.tabForBoard(board.id)).map(board => board.id)
      : [boardId]);
    if (tabKey) {
      const tab = this.tabs.find(item => item.clientKey === tabKey);
      if (tab) {
        this.assignBoards(ids, tab);
        if (this.collapsed[tab.clientKey]) {
          this.collapsed = { ...this.collapsed, [tab.clientKey]: false };
        }
      }
    } else if (this.overBoardPool(event.dropPoint)) {
      this.unassignBoards(ids);
    }
    this.hoverKey = null;
    event.source.reset();
  }

  pickSymbol(tab: TabDraft) {
    this.dialogService.openMediaLibrary({
      sources: ['symbols', 'user_media'],
      allowClear: true
    }).afterClosed().subscribe((media: Media) => {
      if (media === undefined) { return; }
      tab.image_url = media && media.public_url ? media.public_url : '';
    });
  }

  save() {
    if (this.saving) { return; }
    const missing = this.tabs.find(tab => !tab.label || !tab.label.trim());
    if (missing) {
      this.error = 'Each tab needs a label.';
      return;
    }
    this.saving = true;
    this.error = null;
    this.boardSetService.saveTabs(this.boardSet.id, {
      catalogue_tabs: this.enabled,
      tab_edge: this.edge,
      tabs: this.tabs.map((tab, index) => {
        const row: {
          id?: number;
          label: string;
          colour: string;
          image_url: string;
          position: number;
          board_ids: number[];
        } = {
          label: tab.label.trim(),
          colour: tab.colour,
          image_url: tab.image_url || '',
          position: index,
          board_ids: tab.boardIds
        };
        if (tab.id) { row.id = tab.id; }
        return row;
      })
    }).subscribe(
      result => {
        this.saving = false;
        this.dialogRef.close(result);
      },
      err => {
        this.saving = false;
        this.error = err?.error?.error || 'Could not save tab settings.';
      }
    );
  }

  private tabKeyAt(point: { x: number, y: number }, ignore?: Element): string {
    if (!point || !document.elementsFromPoint) { return null; }
    const stack = document.elementsFromPoint(point.x, point.y);
    for (const el of Array.from(stack)) {
      if (ignore && (el === ignore || ignore.contains(el))) { continue; }
      const node = el as HTMLElement;
      if (node.closest('.cdk-drag-preview, .cdk-drag-placeholder, .cdk-drag-dragging')) { continue; }
      const tab = node.closest('[data-tab-key]') as HTMLElement;
      if (tab) { return tab.getAttribute('data-tab-key'); }
    }
    return null;
  }

  private overBoardPool(point: { x: number, y: number }): boolean {
    const stack = document.elementsFromPoint(point.x, point.y);
    return Array.from(stack).some(el => !!(el as HTMLElement).closest('[data-board-pool]'));
  }
}
