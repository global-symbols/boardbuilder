import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-home-panel',
  templateUrl: './home-panel.component.html',
  styleUrls: ['./home-panel.component.scss']
})
export class HomePanelComponent {

  @Input() even: boolean;
  @Input() headingType: 'h1' | 'h2' = 'h2';

  @Input() heading: string;
  @Input() imageUrl: string;

}
