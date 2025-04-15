import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component:DashboardComponent
  },
  {
    path: 'dashboard',
    component:DashboardComponent
  },
  {
    path: 'dynamic-form',
    loadChildren: () =>
      import('./dynamic-form/dynamic-form.module').then(
        (m) => m.DynamicFormModule,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
