import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

const BOOTSTRAP_FN_NAME = 'ngBootstrap';

if (environment.production) {
  enableProdMode();
}

const bootstrapFn = (opts?) => platformBrowserDynamic().bootstrapModule(AppModule, opts);
window[BOOTSTRAP_FN_NAME] = bootstrapFn;
