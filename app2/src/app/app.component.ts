import {Component, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {of} from 'rxjs';
import {mergeMap, tap} from 'rxjs/operators';
import {AppService} from './app.service';

@Component({
  selector: 'app-2',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy{
  title = 'app2';

  constructor(private router: Router, s: AppService) {
    console.timeEnd('bootstrap')
  }

  go() {
    this.router.navigate(['/lazy/']);
  }

  ngOnDestroy() {
    console.log('destroyComp');
  }

}
