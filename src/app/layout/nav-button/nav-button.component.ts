import {Component, Input, OnInit} from '@angular/core';
import {ToolbarButton} from '@app/services/toolbar.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-nav-button',
  templateUrl: './nav-button.component.html',
  styleUrls: ['./nav-button.component.scss']
})
export class NavButtonComponent {

  @Input() button: ToolbarButton;

  click() {
    if (this.button.action) { this.button.action(); }
  }

}
