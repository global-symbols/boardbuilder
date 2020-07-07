import { Injectable } from '@angular/core';
import {OAuthInfoEvent, OAuthService, OAuthSuccessEvent} from 'angular-oauth2-oidc';
import {authCodeFlowConfig} from '../../app.module';
import {BehaviorSubject} from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUserSource = new BehaviorSubject<object>(null);
  currentUser$ = this.currentUserSource.asObservable();
  currentUser: object;

  constructor(private oauthService: OAuthService) {
    // Subscribe to OAuth events
    this.oauthService.events.subscribe(event => {

      // Clear user data when the user logs out.
      if (event instanceof OAuthInfoEvent && event.type === 'logout') {
        this.currentUserSource.next(null);
      }

      // Load User data when the user logs in.
      if (event instanceof OAuthSuccessEvent && event.type === 'user_profile_loaded') {
        this.loadUserProfile();
      }

      // Handy for identifying when other events fire.
      // (event instanceof OAuthSuccessEvent) ? console.warn(event) : console.error(event);
    });
    this.currentUser$.subscribe(user => this.currentUser = user);
  }

  loadUserProfile() {
    if (this.oauthService.getIdentityClaims()) {
      this.currentUserSource.next(this.oauthService.getIdentityClaims());
    } else {
      this.currentUserSource.next(null);
    }
  }

  login() {
    console.log('running initCodeFlow');
    // this.oauthService.loadDiscoveryDocumentAndTryLogin();
    this.oauthService.initCodeFlow();
  }

  getIdentityClaims() {
    return this.oauthService.getGrantedScopes();
  }

  isLoggedIn(): boolean {
    return !!this.oauthService.getIdentityClaims();
  }

  logOut() {
    this.oauthService.logOut();
  }
}
