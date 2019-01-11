import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ReactiveFormsModule } from '@angular/forms';
import { RequesterRoutingModule } from './requester-routing.module';
import { EdudetailsComponent } from './edudetails/edudetails.component';
import { ReqpermissionComponent } from './reqpermission/reqpermission.component';
import { ReqdashboardComponent } from './reqdashboard/reqdashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { MaterialModule } from '../material/material.module';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  imports: [
    CommonModule,
    RequesterRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  declarations: [ EdudetailsComponent, ReqpermissionComponent, ReqdashboardComponent, ProfileComponent],
  providers: [CookieService]
})
export class RequesterModule { }
