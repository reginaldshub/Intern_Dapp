import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing.module';
import { EducationComponent } from './education/education.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RequestsComponent } from './requests/requests.component';

@NgModule({
  imports: [
    CommonModule,
    StudentRoutingModule
  ],
  declarations: [EducationComponent, DashboardComponent, RequestsComponent]
})
export class StudentModule { }
