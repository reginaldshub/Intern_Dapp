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
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { AccountComponent } from './account/account.component';

@NgModule({
  imports: [
    CommonModule,
    RequesterRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ],
  declarations: [EdudetailsComponent, 
    ReqpermissionComponent, 
    ReqdashboardComponent, 
    ProfileComponent,
    RequesterComponent, 
    SearchComponent, 
    RequestsComponent,
    HeaderComponent,
    SidenavListComponent,
    AccountComponent]
})
export class RequesterModule { }
