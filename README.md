# BoardbuilderAngular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.4.

# Install
* clone the repository
* install the correct version of node and npm, [matching to the used version of Angular](https://angular.io/guide/versions)
   * it's easy to install and switch node versions [using nvm](https://github.com/nvm-sh/nvm)
   * e.g. `nvm install 14.15.0` or `nvm use 14.15.0`
* run `npm install`
* run `npm run start` (always do `nvm use 14.15.0` before in a new terminal session)

## Loading Cell Images
Images must be loaded with the 'origin' header, to ensure responses cached in the browser contain CORS headers.

To do this, ensure <img> tags have the crossorigin="" attribute. 


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Deployment 
### Deploy to app.globalsymbols.com
`firebase deploy`

### Deploy to app-dev.globalsymbols.com
`ng deploy`

### Deploy preview to Firebase
`firebase hosting:channel:deploy preview_name`

### Deploy i18n to Ionos
`scp -r dist/boardbuilder/* u97814378@access789453002.webspace-data.io:~/app.globalsymbols.com`

## Adding a new Locale
Several steps are required to add a new translation.

In this example, we are adding the 'fr' language.
### 1. In Weblate
1. Create the new translation and translate some strings.
2. `git push` the changes to the project repo.
### 2. In the BoardBuilder app
1. `git pull` to load the translation file made by Weblate.
2. Add the `fr` locale to `availableLocales()` in the `LocaleService`.
3. Add the locale and link the translation file in `angular.json > projects.i18n.locales`.
4. Add redirects for the locale in `firebase.json`.

### 3. In Doorkeeper configuration on globalsymbols.com
1. Add two locale-specific URLs to the list of [allowed callback URLs in Doorkeeper](https://globalsymbols.com/oauth/applications/1).
   * `https://app.globalsymbols.com/fr`
   * `https://app.globalsymbols.com/fr/silent-refresh.html`
  

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
