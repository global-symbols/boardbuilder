import {OAuthModuleConfig} from 'angular-oauth2-oidc';
import {environment} from '@env';

export const authModuleConfig: OAuthModuleConfig = {
  resourceServer: {
    allowedUrls: [
      environment.boardBuilderApiBase,
      environment.globalSymbolsApiBase
    ],
    sendAccessToken: true
  }
};
