import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {AuthService} from '@app/services/auth.service';
import {NavigationEnd, Router} from '@angular/router';

declare let googleAnalytics: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'boardbuilder';

  isAuthenticated: Observable<boolean>;
  isDoneLoading: Observable<boolean>;
  canActivateProtectedRoutes: Observable<boolean>;
  showAuthDebug = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.isAuthenticated = this.authService.isAuthenticated$;
    this.isDoneLoading = this.authService.isDoneLoading$;
    this.canActivateProtectedRoutes = this.authService.canActivateProtectedRoutes$;

    this.authService.runInitialLoginSequence().then();

    // Subscribe to Router Events
    this.router.events.subscribe(event => {
      // When a navigation is completed...
      if (event instanceof NavigationEnd) {
        // Push a pageview to Google Analytics.
        googleAnalytics('config', 'UA-171526118-2', {page_path: event.urlAfterRedirects});
      }
    });
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
}
