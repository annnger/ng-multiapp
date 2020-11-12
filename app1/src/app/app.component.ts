import { Component } from '@angular/core';

@Component({
  selector: 'app-1',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app1';
  constructor() {
    console.timeEnd('bootstrap')
  }
}
