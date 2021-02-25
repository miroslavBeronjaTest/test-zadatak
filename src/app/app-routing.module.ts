import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

export const routes: Routes = [
  { path: 'home',
    data: {
      name: 'Home'
    },
    loadChildren: () => import(`./component/home/home.module`)
      .then(m => m.HomeModule)
  },
  { path: 'new-patient',
    data: {
      name: 'New patient'
    },
    loadChildren: () => import(`./component/new-patient/new-patient.module`)
      .then(m => m.NewPatientModule)
  },
  { path: 'list-patients',
    data: {
      name: 'List patients'
    },
    loadChildren: () => import(`./component/list-patients/list-patients.module`)
      .then(m => m.ListPatientsModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    paramsInheritanceStrategy: 'always',
    onSameUrlNavigation: 'reload',
    useHash: true,
    preloadingStrategy: PreloadAllModules,
    initialNavigation: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
