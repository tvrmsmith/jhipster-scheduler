import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ZipCodeComponent } from '../list/zip-code.component';
import { ZipCodeDetailComponent } from '../detail/zip-code-detail.component';
import { ZipCodeUpdateComponent } from '../update/zip-code-update.component';
import { ZipCodeRoutingResolveService } from './zip-code-routing-resolve.service';

const zipCodeRoute: Routes = [
  {
    path: '',
    component: ZipCodeComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ZipCodeDetailComponent,
    resolve: {
      zipCode: ZipCodeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ZipCodeUpdateComponent,
    resolve: {
      zipCode: ZipCodeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ZipCodeUpdateComponent,
    resolve: {
      zipCode: ZipCodeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(zipCodeRoute)],
  exports: [RouterModule],
})
export class ZipCodeRoutingModule {}
