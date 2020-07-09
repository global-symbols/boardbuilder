import { Component } from '@angular/core';
import {Observable} from 'rxjs';
import {SampleAuthService} from '@app/services/sample-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'boardbuilder-angular';

  isAuthenticated: Observable<boolean>;
  isDoneLoading: Observable<boolean>;
  canActivateProtectedRoutes: Observable<boolean>;

  constructor(
    private authService: SampleAuthService,
  ) {
    this.isAuthenticated = this.authService.isAuthenticated$;
    this.isDoneLoading = this.authService.isDoneLoading$;
    this.canActivateProtectedRoutes = this.authService.canActivateProtectedRoutes$;

    this.authService.runInitialLoginSequence();
  }

  login() { this.authService.login(); }
  logout() { this.authService.logout(); }
  refresh() { this.authService.refresh(); }
  reload() { window.location.reload(); }
  clearStorage() { localStorage.clear(); }

  logoutExternally() {
    window.open(this.authService.logoutUrl);
  }

  get hasValidToken() { return this.authService.hasValidToken(); }
  get accessToken() { return this.authService.accessToken; }
  get refreshToken() { return this.authService.refreshToken; }
  get identityClaims() { return this.authService.identityClaims; }
  get idToken() { return this.authService.idToken; }

  // constructor(private oauthService: OAuthService) {
  //   // this.oauthService.configure(authCodeFlowConfig);
  //   // console.log('AppComponent is loading discover docuemnt');
  //   // this.oauthService.loadDiscoveryDocumentAndTryLogin().then(dd => {
  //   //   console.log('dd', dd);
  //   //   console.log(this.oauthService.getIdentityClaims());
  //   //   console.log(this.oauthService.getAccessToken());
  //   //   console.log(this.oauthService.getGrantedScopes());
  //   // }, err => console.error(err));
  //
  //   this.configure();
  // }
  //
  //
  //
  // private configure() {
  //   this.oauthService.configure(authCodeFlowConfig);
  //   this.oauthService.loadDiscoveryDocumentAndTryLogin();
  // }
}
