import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IZipCode, getZipCodeIdentifier } from '../zip-code.model';

export type EntityResponseType = HttpResponse<IZipCode>;
export type EntityArrayResponseType = HttpResponse<IZipCode[]>;

@Injectable({ providedIn: 'root' })
export class ZipCodeService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/zip-codes');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(zipCode: IZipCode): Observable<EntityResponseType> {
    return this.http.post<IZipCode>(this.resourceUrl, zipCode, { observe: 'response' });
  }

  update(zipCode: IZipCode): Observable<EntityResponseType> {
    return this.http.put<IZipCode>(`${this.resourceUrl}/${getZipCodeIdentifier(zipCode) as number}`, zipCode, { observe: 'response' });
  }

  partialUpdate(zipCode: IZipCode): Observable<EntityResponseType> {
    return this.http.patch<IZipCode>(`${this.resourceUrl}/${getZipCodeIdentifier(zipCode) as number}`, zipCode, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IZipCode>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IZipCode[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addZipCodeToCollectionIfMissing(zipCodeCollection: IZipCode[], ...zipCodesToCheck: (IZipCode | null | undefined)[]): IZipCode[] {
    const zipCodes: IZipCode[] = zipCodesToCheck.filter(isPresent);
    if (zipCodes.length > 0) {
      const zipCodeCollectionIdentifiers = zipCodeCollection.map(zipCodeItem => getZipCodeIdentifier(zipCodeItem)!);
      const zipCodesToAdd = zipCodes.filter(zipCodeItem => {
        const zipCodeIdentifier = getZipCodeIdentifier(zipCodeItem);
        if (zipCodeIdentifier == null || zipCodeCollectionIdentifiers.includes(zipCodeIdentifier)) {
          return false;
        }
        zipCodeCollectionIdentifiers.push(zipCodeIdentifier);
        return true;
      });
      return [...zipCodesToAdd, ...zipCodeCollection];
    }
    return zipCodeCollection;
  }
}
