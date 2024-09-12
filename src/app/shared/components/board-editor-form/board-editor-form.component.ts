import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Board} from '@data/models/board.model';
import {BoardTemplate} from '@data/models/board-template.model';
import {BoardService} from '@data/services/board.service';

@Component({
  selector: 'app-board-editor-form',
  templateUrl: './board-editor-form.component.html',
  styleUrls: ['./board-editor-form.component.scss']
})
export class BoardEditorFormComponent implements OnInit {

  @Input() board: Board;

  @ViewChild('titleField') titleField: ElementRef;

  templates: BoardTemplate[];
  selectedTab: number;

  constructor(
    private service: BoardService
  ) { }

  ngOnInit(): void {
    this.service.templates().subscribe(
      templates => {
        this.templates = templates;

        // If the Board doesn't match any Generic Templates, select the Custom Settings tab.
        if (this.board.persisted() && !templates.find(t => this.board.matchesTemplate(t))) {
          this.selectedTab = 2;
        }
      }
    );
  }

  selectTemplate(template: BoardTemplate) {
    this.board.setDimensions(template.board.rows, template.board.columns);
    this.board.captions_position = template.board.captions_position;
  }

  focusTitleField(): void {
    setTimeout(() => this.titleField.nativeElement.select(), 500);
  }

}
