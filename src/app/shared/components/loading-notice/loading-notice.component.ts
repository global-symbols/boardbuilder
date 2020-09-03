import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-loading-notice',
  templateUrl: './loading-notice.component.html',
  styleUrls: ['./loading-notice.component.scss']
})
export class LoadingNoticeComponent implements OnInit {

  @Input() action: string;
  @Input() subject: string;

  constructor() { }

  ngOnInit(): void {
  }

}
