import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { JobRequestComponent } from '../list/job-request.component';
import { JobRequestDetailComponent } from '../detail/job-request-detail.component';
import { JobRequestUpdateComponent } from '../update/job-request-update.component';
import { JobRequestRoutingResolveService } from './job-request-routing-resolve.service';

const jobRequestRoute: Routes = [
  {
    path: '',
    component: JobRequestComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: JobRequestDetailComponent,
    resolve: {
      jobRequest: JobRequestRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: JobRequestUpdateComponent,
    resolve: {
      jobRequest: JobRequestRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: JobRequestUpdateComponent,
    resolve: {
      jobRequest: JobRequestRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(jobRequestRoute)],
  exports: [RouterModule],
})
export class JobRequestRoutingModule {}
