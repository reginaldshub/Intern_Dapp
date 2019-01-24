import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ReactiveFormsModule } from '@angular/forms';
import { RequesterRoutingModule } from './requester-routing.module';
import { EdudetailsComponent } from './edudetails/edudetails.component';
import { ReqpermissionComponent } from './reqpermission/reqpermission.component';
import { ReqdashboardComponent } from './reqdashboard/reqdashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { MaterialModule } from '../material/material.module';
import { RequesterComponent } from './requester.component';
import { SearchComponent } from './search/search.component';
import { RequestsComponent } from './requests/requests.component';

@NgModule({
  imports: [
    CommonModule,
    RequesterRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  declarations: [EdudetailsComponent, ReqpermissionComponent, ReqdashboardComponent, ProfileComponent,RequesterComponent, SearchComponent, RequestsComponent]
})
export class RequesterModule { }
