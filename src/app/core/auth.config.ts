import {AuthConfig} from 'angular-oauth2-oidc';
import {environment} from '@env';
import {LOCALE_ID} from '@angular/core';

export const authConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer: environment.globalSymbolsBase,

  // loginUrl: 'http://localhost:3000/oauth/authorize',
  // tokenEndpoint: 'http://localhost:3000/oauth/token',
  // revocationEndpoint: 'http://localhost:3000/oauth/revoke',

  // URL of the SPA to redirect the user to after login
  redirectUri: window.location.origin + '/' + LOCALE_ID,

  // The SPA's id. The SPA is registerd with this id at the auth-server
  // clientId: 'server.code',
  clientId: environment.globalSymbolsOauthClientId,

  // Just needed if your auth server demands a secret. In general, this
  // is a sign that the auth server is not configured with SPAs in mind
  // and it might not enforce further best practices vital for security
  // such applications.
  // dummyClientSecret: 'secret',

  responseType: 'code',

  // set the scope for the permissions the client should request
  // The first four are defined by OIDC.
  // Important: Request offline_access to get a refresh token
  // The api scope is a usecase specific one
  scope: 'openid profile email boardset:read boardset:write offline_access',

  // showDebugInformation: !environment.production,
  showDebugInformation: true,
  // nonceStateSeparator : 'semicolon' // ?????

  // sessionChecks requires sessionCheckIFrameUrl to be specified
  // sessionChecksEnabled: true,


  // Silently refresh tokens when they are close to expiry.
  // See https://manfredsteyer.github.io/angular-oauth2-oidc/docs/additional-documentation/refreshing-a-token-(silent-refresh).html
  useSilentRefresh: true,
  silentRefreshRedirectUri: window.location.origin + '/' + LOCALE_ID + '/silent-refresh.html',

  // When a silent refresh fails, the service will wait this many seconds before trying again. Milliseconds. Defaults to 20 seconds.
  // silentRefreshTimeout: 20000,

  // Tokens will be refreshed after this fraction of their validity period. Defaults to 0.75.
  // timeoutFactor: 0.75,

  // logoutUrl: 'http://localhost:3000/users/sign_out',
};
