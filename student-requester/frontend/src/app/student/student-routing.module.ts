import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EducationComponent } from './education/education.component';
import { RequestsComponent } from './requests/requests.component';
import { AuthGuard } from '../auth.guard';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { Add10thComponent } from './education/add10th/add10th.component';
import { AccountComponent } from './account/account.component';
import { PucComponent } from './education/puc/puc.component';
import { DegreeComponent } from './education/degree/degree.component';
import { MastersComponent } from './education/masters/masters.component';
import { SelfcertificateComponent } from './education/selfcertificate/selfcertificate.component';
import { CommitComponent } from './education/commit/commit.component';

const routes: Routes = [
{
   path: '', component: DashboardComponent,
   children:[
    { path: '', component: RequestsComponent},
     { path: 'education', component: EducationComponent},
     { path: 'profile', component: StudentProfileComponent},
     { path: 'requests', component: RequestsComponent},
     { path: 'add10th', component: Add10thComponent},
     { path: 'puc', component: PucComponent},
     { path: 'degree', component:DegreeComponent},
     { path: 'masters', component:MastersComponent},
     { path: 'certificates', component:SelfcertificateComponent},
     { path: 'commit', component:CommitComponent},
     { path: 'account', component:AccountComponent}
   ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
