import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material/material.module';
import { StudentRoutingModule } from './student-routing.module';
import { EducationComponent } from './education/education.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RequestsComponent } from './requests/requests.component';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Add10thComponent } from './education/add10th/add10th.component';
import { HttpClientModule } from '@angular/common/http';
import { PucComponent } from './education/puc/puc.component';
import { DegreeComponent } from './education/degree/degree.component';
import { MastersComponent } from './education/masters/masters.component';
// import { CommonbothModule } from '../common/common.module';
//  import { AccountComponent } from '../common/account/account.component';

@NgModule({
  imports: [
    CommonModule,
    StudentRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule
  //  CommonbothModule
  ],
  declarations: [ 
  Add10thComponent,EducationComponent, DashboardComponent, RequestsComponent, StudentProfileComponent, PucComponent, DegreeComponent, MastersComponent]
})
export class StudentModule { }