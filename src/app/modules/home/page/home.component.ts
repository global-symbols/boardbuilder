import { Component, OnInit } from '@angular/core';
import {AuthService} from '@app/services/auth.service';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isDoneLoading: Observable<boolean>;
  canActivateProtectedRoutes: Observable<boolean>;

  signedIn: boolean;

  // Width in % of the text columns
  textColumnWidth = 45;
  panelLayoutGap = '40px grid';
  panelLayoutAlign = 'space-between center';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.isDoneLoading = this.authService.isDoneLoading$;
    this.canActivateProtectedRoutes = this.authService.canActivateProtectedRoutes$;

    this.authService.canActivateProtectedRoutes$.subscribe(canActivate => this.signedIn = canActivate);
  }

  ngOnInit(): void {
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
