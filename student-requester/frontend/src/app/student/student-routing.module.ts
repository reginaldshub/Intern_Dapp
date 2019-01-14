import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EducationComponent } from './education/education.component';
import { RequestsComponent } from './requests/requests.component';
import { AuthGuard } from '../auth.guard';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { Add10thComponent } from './education/add10th/add10th.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'education', component: EducationComponent, canActivate: [AuthGuard] },
  { path: 'add10th',component:Add10thComponent, canActivate:[AuthGuard]},
  { path: 'requests', component: RequestsComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: StudentProfileComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
