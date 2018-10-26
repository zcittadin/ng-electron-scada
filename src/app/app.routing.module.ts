import { NgModule } from '@angular/core';

import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConsultasComponent } from './components/consultas/consultas.component';
import { ProcessoComponent } from './components/processo/processo.component';

const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'processo' },
  { path: 'processo', component: ProcessoComponent },
  { path: 'consultas', component: ConsultasComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
