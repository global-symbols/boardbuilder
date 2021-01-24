import {Component, Input} from '@angular/core';
import {ToolbarButton} from '@app/services/toolbar.service';

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
