// import { CertificatesComponent } from './certificates/certificates.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReqdashboardComponent } from './reqdashboard/reqdashboard.component';
import { EdudetailsComponent } from './edudetails/edudetails.component';
import { ReqpermissionComponent } from './reqpermission/reqpermission.component';
import { ProfileComponent } from './profile/profile.component';
import { Auth1Guard } from '../auth1.guard';
import { RequesterComponent } from './requester.component';
import { SearchComponent } from './search/search.component';
import { RequestsComponent } from './requests/requests.component';
import { AccountComponent } from './account/account.component';


const routes: Routes = [
  {
    path: '', component: ReqdashboardComponent,
    children: [
      { path: '', component: SearchComponent, canActivate: [Auth1Guard] },
      { path: 'dashboard', component: ReqdashboardComponent, canActivate: [Auth1Guard] },
      { path: 'edudetails', component: EdudetailsComponent, canActivate: [Auth1Guard] },
      { path: 'edudetails/:name', component: EdudetailsComponent, canActivate: [Auth1Guard] },
      { path: 'reqpermission', component: ReqpermissionComponent, canActivate: [Auth1Guard] },
      { path: 'profile', component: ProfileComponent, canActivate: [Auth1Guard] },
      { path: 'search', component: SearchComponent, canActivate: [Auth1Guard] },
      { path: 'requests', component: RequestsComponent, canActivate: [Auth1Guard] },
      { path: 'account', component: AccountComponent, canActivate: [Auth1Guard] }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequesterRoutingModule { }
