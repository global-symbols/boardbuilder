import { Component, OnInit } from '@angular/core';
import {BoardSetService} from '@data/services/board-set.service';
import {Observable} from 'rxjs';
import {BoardSet} from '@data/models/boardset.model';

@Component({
  selector: 'app-board-sets',
  templateUrl: './board-sets.component.html',
  styleUrls: ['./board-sets.component.css']
})
export class BoardSetsComponent implements OnInit {

  boardSets: Observable<BoardSet[]>;

  constructor(private service: BoardSetService) { }

  ngOnInit(): void {
    this.loadBoardSets();
  }

  loadBoardSets(): void {
    this.boardSets = this.service.list();
  }

}
