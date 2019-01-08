import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ReactiveFormsModule } from '@angular/forms';
import { RequesterRoutingModule } from './requester-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EdudetailsComponent } from './edudetails/edudetails.component';
import { ReqpermissionComponent } from './reqpermission/reqpermission.component';
import { ReqdashboardComponent } from './reqdashboard/reqdashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { MaterialModule } from '../material/material.module';

@NgModule({
  imports: [
    CommonModule,
    RequesterRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  declarations: [DashboardComponent, EdudetailsComponent, ReqpermissionComponent, ReqdashboardComponent, ProfileComponent]
})
export class RequesterModule { }
