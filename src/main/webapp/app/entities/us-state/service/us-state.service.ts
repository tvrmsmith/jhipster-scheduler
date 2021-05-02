import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUsState, getUsStateIdentifier } from '../us-state.model';

export type EntityResponseType = HttpResponse<IUsState>;
export type EntityArrayResponseType = HttpResponse<IUsState[]>;

@Injectable({ providedIn: 'root' })
export class UsStateService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/us-states');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(usState: IUsState): Observable<EntityResponseType> {
    return this.http.post<IUsState>(this.resourceUrl, usState, { observe: 'response' });
  }

  update(usState: IUsState): Observable<EntityResponseType> {
    return this.http.put<IUsState>(`${this.resourceUrl}/${getUsStateIdentifier(usState) as number}`, usState, { observe: 'response' });
  }

  partialUpdate(usState: IUsState): Observable<EntityResponseType> {
    return this.http.patch<IUsState>(`${this.resourceUrl}/${getUsStateIdentifier(usState) as number}`, usState, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUsState>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUsState[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addUsStateToCollectionIfMissing(usStateCollection: IUsState[], ...usStatesToCheck: (IUsState | null | undefined)[]): IUsState[] {
    const usStates: IUsState[] = usStatesToCheck.filter(isPresent);
    if (usStates.length > 0) {
      const usStateCollectionIdentifiers = usStateCollection.map(usStateItem => getUsStateIdentifier(usStateItem)!);
      const usStatesToAdd = usStates.filter(usStateItem => {
        const usStateIdentifier = getUsStateIdentifier(usStateItem);
        if (usStateIdentifier == null || usStateCollectionIdentifiers.includes(usStateIdentifier)) {
          return false;
        }
        usStateCollectionIdentifiers.push(usStateIdentifier);
        return true;
      });
      return [...usStatesToAdd, ...usStateCollection];
    }
    return usStateCollection;
  }
}
