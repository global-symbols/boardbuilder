import {ModuleWithProviders, NgModule} from '@angular/core';
import {AuthConfig, OAuthModule, OAuthModuleConfig, OAuthStorage} from 'angular-oauth2-oidc';
import {authConfig} from '@app/auth.config';
import {HttpClientModule} from '@angular/common/http';
import {AuthService} from '@app/services/auth.service';
import {authModuleConfig} from '@app/auth.module.config';
import {AuthGuard} from '@app/services/auth-guard.service';
import {AuthGuardWithForcedLogin} from '@app/services/auth-guard-with-forced-login.service';
import { ShouldLoginComponent } from './components/should-login/should-login.component';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {RouterModule} from '@angular/router';

// We need a factory since localStorage is not available at AOT build time
export function storageFactory(): OAuthStorage {
  return localStorage;
}

@NgModule({
  imports: [
    HttpClientModule,
    OAuthModule.forRoot(),
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    FlexLayoutModule,
    MatButtonModule,
    RouterModule,
  ],
  providers: [
    AuthService,
    AuthGuard,
    AuthGuardWithForcedLogin,
  ],
  declarations: [ShouldLoginComponent],
})
export class CoreModule {
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        {provide: AuthConfig, useValue: authConfig},
        {provide: OAuthModuleConfig, useValue: authModuleConfig},
        {provide: OAuthStorage, useFactory: storageFactory},
      ]
    };
  }
}
