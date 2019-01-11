import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EducationComponent } from './education/education.component';
import { RequestsComponent } from './requests/requests.component';
import { StudentProfileComponent } from './student-profile/student-profile.component';

const routes: Routes = [
{path:'',            component : DashboardComponent},
{path:'education',    component : EducationComponent},
{path:'requests',     component : RequestsComponent},
{path:'profile',     component : StudentProfileComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
