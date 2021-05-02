import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { InterpreterComponent } from '../list/interpreter.component';
import { InterpreterDetailComponent } from '../detail/interpreter-detail.component';
import { InterpreterUpdateComponent } from '../update/interpreter-update.component';
import { InterpreterRoutingResolveService } from './interpreter-routing-resolve.service';

const interpreterRoute: Routes = [
  {
    path: '',
    component: InterpreterComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: InterpreterDetailComponent,
    resolve: {
      interpreter: InterpreterRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: InterpreterUpdateComponent,
    resolve: {
      interpreter: InterpreterRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: InterpreterUpdateComponent,
    resolve: {
      interpreter: InterpreterRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(interpreterRoute)],
  exports: [RouterModule],
})
export class InterpreterRoutingModule {}
