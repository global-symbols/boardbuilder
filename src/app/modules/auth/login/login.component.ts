import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {AuthService} from '@app/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {

  isDoneLoading: Observable<boolean>;
  canActivateProtectedRoutes: Observable<boolean>;

  subscription: Subscription;

  constructor(private authService: AuthService,
              private router: Router) {
    this.isDoneLoading = this.authService.isDoneLoading$;
    this.canActivateProtectedRoutes = this.authService.canActivateProtectedRoutes$;

    this.subscription = this.authService.canActivateProtectedRoutes$.subscribe(canActivate => {
      if (canActivate) { this.router.navigate(['/', 'boardsets']); }
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from future canActivateProtectedRoutes$ events.
    // This prevents the post-login redirect from firing when LoginComponent is unloaded.
    this.subscription.unsubscribe();
  }

  login() { this.authService.login(); }

}
