import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IInterpreter, Interpreter } from '../interpreter.model';
import { InterpreterService } from '../service/interpreter.service';

@Injectable({ providedIn: 'root' })
export class InterpreterRoutingResolveService implements Resolve<IInterpreter> {
  constructor(protected service: InterpreterService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IInterpreter> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((interpreter: HttpResponse<Interpreter>) => {
          if (interpreter.body) {
            return of(interpreter.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Interpreter());
  }
}
