import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IInterpreter, getInterpreterIdentifier } from '../interpreter.model';

export type EntityResponseType = HttpResponse<IInterpreter>;
export type EntityArrayResponseType = HttpResponse<IInterpreter[]>;

@Injectable({ providedIn: 'root' })
export class InterpreterService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/interpreters');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(interpreter: IInterpreter): Observable<EntityResponseType> {
    return this.http.post<IInterpreter>(this.resourceUrl, interpreter, { observe: 'response' });
  }

  update(interpreter: IInterpreter): Observable<EntityResponseType> {
    return this.http.put<IInterpreter>(`${this.resourceUrl}/${getInterpreterIdentifier(interpreter) as number}`, interpreter, {
      observe: 'response',
    });
  }

  partialUpdate(interpreter: IInterpreter): Observable<EntityResponseType> {
    return this.http.patch<IInterpreter>(`${this.resourceUrl}/${getInterpreterIdentifier(interpreter) as number}`, interpreter, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IInterpreter>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IInterpreter[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addInterpreterToCollectionIfMissing(
    interpreterCollection: IInterpreter[],
    ...interpretersToCheck: (IInterpreter | null | undefined)[]
  ): IInterpreter[] {
    const interpreters: IInterpreter[] = interpretersToCheck.filter(isPresent);
    if (interpreters.length > 0) {
      const interpreterCollectionIdentifiers = interpreterCollection.map(interpreterItem => getInterpreterIdentifier(interpreterItem)!);
      const interpretersToAdd = interpreters.filter(interpreterItem => {
        const interpreterIdentifier = getInterpreterIdentifier(interpreterItem);
        if (interpreterIdentifier == null || interpreterCollectionIdentifiers.includes(interpreterIdentifier)) {
          return false;
        }
        interpreterCollectionIdentifiers.push(interpreterIdentifier);
        return true;
      });
      return [...interpretersToAdd, ...interpreterCollection];
    }
    return interpreterCollection;
  }
}
