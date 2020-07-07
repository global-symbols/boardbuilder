import { Component } from '@angular/core';
import {OAuthService} from 'angular-oauth2-oidc';
import {authCodeFlowConfig} from './app.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'boardbuilder-angular';

  constructor(private oauthService: OAuthService) {
    this.oauthService.configure(authCodeFlowConfig);
  }
}
