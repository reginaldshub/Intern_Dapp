import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';


import { CommonRoutingModule } from './common-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountComponent } from './account/account.component';

@NgModule({
  imports: [
    CommonModule,
    CommonRoutingModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  declarations: [LoginComponent, RegisterComponent, AccountComponent]
})
export class CommonbothModule { }
