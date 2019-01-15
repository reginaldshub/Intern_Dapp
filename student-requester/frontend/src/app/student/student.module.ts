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

@NgModule({
  imports: [
    CommonModule,
    StudentRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  declarations: [ Add10thComponent,EducationComponent, DashboardComponent, RequestsComponent, StudentProfileComponent,]
})
export class StudentModule { }