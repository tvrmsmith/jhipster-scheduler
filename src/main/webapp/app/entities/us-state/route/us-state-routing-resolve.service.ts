import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUsState, UsState } from '../us-state.model';
import { UsStateService } from '../service/us-state.service';

@Injectable({ providedIn: 'root' })
export class UsStateRoutingResolveService implements Resolve<IUsState> {
  constructor(protected service: UsStateService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUsState> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((usState: HttpResponse<UsState>) => {
          if (usState.body) {
            return of(usState.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new UsState());
  }
}
