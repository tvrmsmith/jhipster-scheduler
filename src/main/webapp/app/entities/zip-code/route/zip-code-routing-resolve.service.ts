import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IZipCode, ZipCode } from '../zip-code.model';
import { ZipCodeService } from '../service/zip-code.service';

@Injectable({ providedIn: 'root' })
export class ZipCodeRoutingResolveService implements Resolve<IZipCode> {
  constructor(protected service: ZipCodeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IZipCode> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((zipCode: HttpResponse<ZipCode>) => {
          if (zipCode.body) {
            return of(zipCode.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ZipCode());
  }
}
