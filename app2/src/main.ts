import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

const BOOTSTRAP_FN_NAME = 'ngBootstrap';
const bootstrapFn = (opts?) => platformBrowserDynamic().bootstrapModule(AppModule, opts);

window[BOOTSTRAP_FN_NAME] = bootstrapFn;
