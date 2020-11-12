import {Injectable, OnDestroy} from '@angular/core';

@Injectable({providedIn: 'root'})
export class AppService implements OnDestroy{
  log() {}

  ngOnDestroy() {
    console.log('destroy service');
  }
}
