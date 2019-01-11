import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReqdashboardComponent } from './reqdashboard/reqdashboard.component';
import { EdudetailsComponent } from './edudetails/edudetails.component';
import { ReqpermissionComponent } from './reqpermission/reqpermission.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: '', component: ReqdashboardComponent },
  { path: 'edudetails', component: EdudetailsComponent },
  { path: 'reqpermission', component: ReqpermissionComponent },
  { path: 'profile', component: ProfileComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequesterRoutingModule { }
