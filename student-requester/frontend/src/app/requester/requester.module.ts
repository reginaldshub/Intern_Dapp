import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequesterRoutingModule } from './requester-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EdudetailsComponent } from './edudetails/edudetails.component';
import { ReqpermissionComponent } from './reqpermission/reqpermission.component';
import { ReqdashboardComponent } from './reqdashboard/reqdashboard.component';

@NgModule({
  imports: [
    CommonModule,
    RequesterRoutingModule
  ],
  declarations: [DashboardComponent, EdudetailsComponent, ReqpermissionComponent, ReqdashboardComponent]
})
export class RequesterModule { }
