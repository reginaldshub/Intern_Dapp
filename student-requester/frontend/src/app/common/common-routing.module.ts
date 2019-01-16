import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from '../auth.guard';
import { CommonComponent } from './common.component';

const routes: Routes = [

  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'account', component: AccountComponent },
  { path: 'login', component: LoginComponent },
  // {
  //   path:'common',
  //   component: CommonComponent,
  //   children:[
  //     { path:'',component:LoginComponent},
  //     { path:'login',component:LoginComponent},
  //     { path:'register',component:RegisterComponent},
  //     //{ path:'home',component:HomeComponent,canActivate: [AuthGuard]}
  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommonRoutingModule { }