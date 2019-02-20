import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { HttpClientModule } from '@angular/common/http';

import { CommonRoutingModule } from './common-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountComponent } from './account/account.component';
import { CommonComponent } from '../common/common.component';
import { CoverComponent } from './cover/cover.component';

@NgModule({
  imports: [
    CommonModule,
    CommonRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    HttpClientModule
  ],
  exports: [
    AccountComponent
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    AccountComponent,
    CommonComponent,
    CoverComponent
  ]
})
export class CommonbothModule { }
