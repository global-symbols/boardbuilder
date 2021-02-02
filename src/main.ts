
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import * as Sentry from '@sentry/angular';

import { AppModule } from './app/app.module';
import { environment } from '@env';
import {Integrations} from '@sentry/tracing';

Sentry.init({
  dsn: 'https://bb7081d5632047029cece9c9b0a2e370@o234539.ingest.sentry.io/5453158',
  integrations: [
    new Integrations.BrowserTracing({
      tracingOrigins: ['localhost', 'https://app.globalsymbols.com'],
      routingInstrumentation: Sentry.routingInstrumentation,
    }),
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,

  environment: environment.production ? 'production' : 'development'
});

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
