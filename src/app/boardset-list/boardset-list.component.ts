import { Component, OnInit } from '@angular/core';
import {BoardSet} from '../models/boardset.model';
import {BoardSetService} from '../board-set.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-boardset-list',
  templateUrl: './boardset-list.component.html',
  styleUrls: ['./boardset-list.component.css']
})
export class BoardsetListComponent implements OnInit {

  boardSets: BoardSet[];

  constructor(private service: BoardSetService,
              private router: Router) { }

  ngOnInit(): void {
    this.service.getBoardSets().then(sets => this.boardSets = sets);
  }

  newBoardSet() {
    this.service.newBoardSet().then(bs => {
      console.log(bs);
      return this.router.navigate(['boardsets', bs.uuid]);
    });
  }
}
