import {Component, ElementRef, Inject, NgModuleRef, NgZone, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DOCUMENT} from '@angular/common';
import {forkJoin, Observable, of} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';

const BOOTSTRAP_FN_NAME = 'ngBootstrap';
type BootstrapFn = (options?: any) => Promise<NgModuleRef<any>>;

const APP_CFG = {
  app1: {
    rootElement: 'app-1'
  },
  app2: {
    rootElement: 'app-2'
  },
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'main';
  currentApp: string;
  ngModule: NgModuleRef<any>;
  appRootElement: HTMLElement;

  appRegistry: {[appName: string]: BootstrapFn} = {};

  @ViewChild('container') appContainer: ElementRef<HTMLDivElement>;

  constructor(
    private http: HttpClient,
    private zone: NgZone,
    @Inject(DOCUMENT) private document: Document) {
  }

  loadApp(appName: string) {
    console.time('bootstrap');
    this.destroyApp();
    this.addAppRootElement(appName);
    this.syncBaseHref(`/${appName}/`);

    this.currentApp = appName;

    this.getBootstrapFn$()
      .subscribe((bootstrapFn: BootstrapFn) => {
        this.zone.runOutsideAngular(() => {
          bootstrapFn().then(m => {
            this.ngModule = m;
          });
        });
      });
  }

  destroyApp() {
    if (!this.currentApp) { return; }
    this.appContainer.nativeElement.removeChild(this.appRootElement);
    this.ngModule.destroy();
    this.ngModule =  null;
  }

  private addAppRootElement(appName: string) {
    this.appRootElement = this.document.createElement(APP_CFG[appName].rootElement);
    this.appContainer.nativeElement.appendChild(this.appRootElement);
  }

  private syncBaseHref(appBaseHref: string) {
    const base = this.document.querySelector('base');

    base.href = appBaseHref;
  }

  private getBootstrapFn$(): Observable<BootstrapFn> {
    const bootstrapFn = this.appRegistry[this.currentApp];
    if (bootstrapFn) {
      return of(bootstrapFn);
    }

    return this.getAppHTML()
      .pipe(
        map(html => this.getScriptUrls(html)),
        switchMap(scriptUrls => this.loadBundles(scriptUrls)),
        map(() => window[BOOTSTRAP_FN_NAME] as BootstrapFn),
        tap(fn => {
          this.appRegistry[this.currentApp] = fn;
          window[BOOTSTRAP_FN_NAME] = null;
        })
      );
  }

  private getAppHTML(): Observable<string> {
    return this.http.get(`/${this.currentApp}/index.html`, {responseType: 'text'});
  }

  private getScriptUrls(html: string): string[] {
    const appDocument: Document = new DOMParser().parseFromString(html, 'text/html');
    const scriptElements = appDocument.querySelectorAll('script');

    return Array.from(scriptElements)
      .map(({src}) => src.replace(this.document.location.origin, ''));
  }

  private loadBundles(scriptUrls: string[]): Observable<void[]> {
    return forkJoin(
      scriptUrls.map(scriptUrl => this.importJs(`${scriptUrl}`))
    );
  }

  private importJs(url: string): Observable<void> {
    return new Observable(sub => {
      const script = this.document.createElement('script');

      script.src = url;
      script.onload = () => {
        this.document.head.removeChild(script);

        sub.next();
        sub.complete();
      };
      script.onerror = (e) => {
        sub.error(e);
      };

      this.document.head.appendChild(script);
    });
  }

}
