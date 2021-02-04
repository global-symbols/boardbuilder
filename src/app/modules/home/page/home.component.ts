import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '@app/services/auth.service';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {ToolbarService} from '@app/services/toolbar.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  isDoneLoading: Observable<boolean>;
  canActivateProtectedRoutes: Observable<boolean>;

  signedIn: boolean;

  panelId = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toolbarService: ToolbarService
  ) {
    this.isDoneLoading = this.authService.isDoneLoading$;
    this.canActivateProtectedRoutes = this.authService.canActivateProtectedRoutes$;

    this.authService.canActivateProtectedRoutes$.subscribe(canActivate => this.signedIn = canActivate);
  }

  login() { this.authService.login(); }

  getStarted() {
    if (this.signedIn) {
      this.router.navigate(['/', 'boardsets']);
    } else {
      this.authService.login();
    }
  }
}
