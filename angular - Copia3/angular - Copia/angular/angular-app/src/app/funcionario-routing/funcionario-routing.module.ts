import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FuncionariosFormComponent } from '../funcionarios/funcionario-form/funcionario-form.component';
const routes: Routes = [
  {path: 'funcionarios', component: FuncionariosFormComponent},
  {path: 'funcionarios/:id', component:FuncionariosFormComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FuncionarioRoutingModule { }
