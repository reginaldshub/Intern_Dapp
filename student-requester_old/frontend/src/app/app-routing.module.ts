import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'abc', redirectTo: 'home', pathMatch: 'full' },
  { path: '', loadChildren:'./common/common.module#CommonbothModule'},
  { path: 'student', loadChildren:'./student/student.module#StudentModule'},
  { path: 'requester', loadChildren:'./requester/requester.module#RequesterModule'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
