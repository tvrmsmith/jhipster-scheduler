import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IJobRequest, JobRequest } from '../job-request.model';
import { JobRequestService } from '../service/job-request.service';

@Injectable({ providedIn: 'root' })
export class JobRequestRoutingResolveService implements Resolve<IJobRequest> {
  constructor(protected service: JobRequestService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IJobRequest> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((jobRequest: HttpResponse<JobRequest>) => {
          if (jobRequest.body) {
            return of(jobRequest.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new JobRequest());
  }
}
