import {Component, Input, OnInit} from '@angular/core';
import {BoardSet} from '@data/models/boardset.model';
import {MatMenu} from '@angular/material/menu';

@Component({
  selector: 'app-board-set-tile',
  templateUrl: './board-set-tile.component.html',
  styleUrls: ['./board-set-tile.component.scss']
})
export class BoardSetTileComponent implements OnInit {

  @Input() boardSet: BoardSet;
  @Input() menu: MatMenu;

  constructor() { }

  ngOnInit(): void {
  }

}
