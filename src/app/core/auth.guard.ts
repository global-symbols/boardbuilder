import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChild, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '@app/services/auth.service';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.canActivateProtectedRoutes$
      .pipe(tap(x => {
        // console.log('You tried to go to ' + state.url + ' and this guard said ' + x);
        // If the Guard denies the action, redirect to the login page.
        if (!x) { this.router.navigateByUrl('/auth/login'); }
      }));
  }

}
