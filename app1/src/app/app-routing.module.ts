import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SomeComponent} from './some/some.component';


const routes: Routes = [
  {path: 'some-component', component: SomeComponent},
  {path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
