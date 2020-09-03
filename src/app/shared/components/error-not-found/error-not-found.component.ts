import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-error-not-found',
  templateUrl: './error-not-found.component.html',
  styleUrls: ['./error-not-found.component.scss']
})
export class ErrorNotFoundComponent implements OnInit {

  @Input() subject: string;

  constructor() { }

  ngOnInit(): void {
  }

}
