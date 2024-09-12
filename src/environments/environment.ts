// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  globalSymbolsBase: 'http://localhost:3000',

  globalSymbolsApiBase: 'http://localhost:3000/api/v1',
  // globalSymbolsApiBase: 'https://globalsymbols.com/api/v1',
  boardBuilderApiBase: 'http://localhost:3000/api/boardbuilder/v1',

  globalSymbolsOauthClientId: 'TmfOdD5gPManAv3UafHGLFDcfcrEkXTjLGT2OPmCFyI',
  astericsGridBase: 'http://localhost:9095'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
