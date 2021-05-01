import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'organization',
        data: { pageTitle: 'schedulerApp.organization.home.title' },
        loadChildren: () => import('./organization/organization.module').then(m => m.OrganizationModule),
      },
      {
        path: 'interpreter',
        data: { pageTitle: 'schedulerApp.interpreter.home.title' },
        loadChildren: () => import('./interpreter/interpreter.module').then(m => m.InterpreterModule),
      },
      {
        path: 'job-request',
        data: { pageTitle: 'schedulerApp.jobRequest.home.title' },
        loadChildren: () => import('./job-request/job-request.module').then(m => m.JobRequestModule),
      },
      {
        path: 'language',
        data: { pageTitle: 'schedulerApp.language.home.title' },
        loadChildren: () => import('./language/language.module').then(m => m.LanguageModule),
      },
      {
        path: 'location',
        data: { pageTitle: 'schedulerApp.location.home.title' },
        loadChildren: () => import('./location/location.module').then(m => m.LocationModule),
      },
      {
        path: 'address',
        data: { pageTitle: 'schedulerApp.address.home.title' },
        loadChildren: () => import('./address/address.module').then(m => m.AddressModule),
      },
      {
        path: 'us-state',
        data: { pageTitle: 'schedulerApp.usState.home.title' },
        loadChildren: () => import('./us-state/us-state.module').then(m => m.UsStateModule),
      },
      {
        path: 'zip-code',
        data: { pageTitle: 'schedulerApp.zipCode.home.title' },
        loadChildren: () => import('./zip-code/zip-code.module').then(m => m.ZipCodeModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
