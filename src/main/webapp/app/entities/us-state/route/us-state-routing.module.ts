import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UsStateComponent } from '../list/us-state.component';
import { UsStateDetailComponent } from '../detail/us-state-detail.component';
import { UsStateUpdateComponent } from '../update/us-state-update.component';
import { UsStateRoutingResolveService } from './us-state-routing-resolve.service';

const usStateRoute: Routes = [
  {
    path: '',
    component: UsStateComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UsStateDetailComponent,
    resolve: {
      usState: UsStateRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UsStateUpdateComponent,
    resolve: {
      usState: UsStateRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UsStateUpdateComponent,
    resolve: {
      usState: UsStateRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(usStateRoute)],
  exports: [RouterModule],
})
export class UsStateRoutingModule {}
