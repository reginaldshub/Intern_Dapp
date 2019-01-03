import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Material  from '@angular/material';
@NgModule({
  imports: [
    CommonModule,
    Material.MatInputModule,
    Material.MatFormFieldModule,
    Material.MatButtonModule,
    Material.MatIconModule,
    Material.MatToolbarModule,
    Material.MatMenuModule,
    Material.MatCardModule
  ],
  exports:[
    Material.MatInputModule,
    Material.MatFormFieldModule,
    Material.MatButtonModule,
    Material.MatIconModule,
    Material.MatToolbarModule,
    Material.MatMenuModule,
    Material.MatCardModule
  ],
  declarations: []
})
export class MaterialModule { }
