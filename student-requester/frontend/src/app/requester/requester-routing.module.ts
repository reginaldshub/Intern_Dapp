import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReqdashboardComponent } from './reqdashboard/reqdashboard.component';
import { EdudetailsComponent } from './edudetails/edudetails.component';
import { ReqpermissionComponent } from './reqpermission/reqpermission.component';
import { ProfileComponent } from './profile/profile.component';
import { Auth1Guard } from '../auth1.guard';
import { RequesterComponent } from './requester.component';

const routes: Routes = [
  //       {
  // path:'requester',
  // component:RequesterComponent,
  // children:[
  { path: '', component: ReqdashboardComponent, canActivate: [Auth1Guard] },
  { path: 'edudetails', component: EdudetailsComponent, canActivate: [Auth1Guard] },
  { path: 'reqpermission', component: ReqpermissionComponent, canActivate: [Auth1Guard] },
  { path: 'profile', component: ProfileComponent, canActivate: [Auth1Guard] }
]
        // }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequesterRoutingModule { }
