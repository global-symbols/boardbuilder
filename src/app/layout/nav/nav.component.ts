import { Component, OnInit } from '@angular/core';
import {AuthService} from '@app/services/auth.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  canActivateProtectedRoutes: Observable<boolean>;

  constructor(private authService: AuthService) {
    this.canActivateProtectedRoutes = this.authService.canActivateProtectedRoutes$;
  }

  ngOnInit(): void {
  }

  login() { this.authService.login(); }
  logout() { this.authService.logout(); }
  get identityClaims() { return this.authService.identityClaims; }

}
