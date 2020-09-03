import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {AuthService} from '@app/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-should-login',
  templateUrl: './should-login.component.html',
  styleUrls: ['./should-login.component.scss']
})
export class ShouldLoginComponent implements OnInit {

  isDoneLoading: Observable<boolean>;
  canActivateProtectedRoutes: Observable<boolean>;

  constructor(private authService: AuthService,
              private router: Router) {
    this.isDoneLoading = this.authService.isDoneLoading$;
    this.canActivateProtectedRoutes = this.authService.canActivateProtectedRoutes$;

    this.authService.canActivateProtectedRoutes$.subscribe(canActivate => {
      if (canActivate) { this.router.navigate(['/', 'boardsets']); }
    });
  }

  ngOnInit(): void {
  }

  login() { this.authService.login(); }

}
