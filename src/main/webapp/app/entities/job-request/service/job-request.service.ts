import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IJobRequest, getJobRequestIdentifier } from '../job-request.model';

export type EntityResponseType = HttpResponse<IJobRequest>;
export type EntityArrayResponseType = HttpResponse<IJobRequest[]>;

@Injectable({ providedIn: 'root' })
export class JobRequestService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/job-requests');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(jobRequest: IJobRequest): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(jobRequest);
    return this.http
      .post<IJobRequest>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(jobRequest: IJobRequest): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(jobRequest);
    return this.http
      .put<IJobRequest>(`${this.resourceUrl}/${getJobRequestIdentifier(jobRequest) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(jobRequest: IJobRequest): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(jobRequest);
    return this.http
      .patch<IJobRequest>(`${this.resourceUrl}/${getJobRequestIdentifier(jobRequest) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IJobRequest>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IJobRequest[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addJobRequestToCollectionIfMissing(
    jobRequestCollection: IJobRequest[],
    ...jobRequestsToCheck: (IJobRequest | null | undefined)[]
  ): IJobRequest[] {
    const jobRequests: IJobRequest[] = jobRequestsToCheck.filter(isPresent);
    if (jobRequests.length > 0) {
      const jobRequestCollectionIdentifiers = jobRequestCollection.map(jobRequestItem => getJobRequestIdentifier(jobRequestItem)!);
      const jobRequestsToAdd = jobRequests.filter(jobRequestItem => {
        const jobRequestIdentifier = getJobRequestIdentifier(jobRequestItem);
        if (jobRequestIdentifier == null || jobRequestCollectionIdentifiers.includes(jobRequestIdentifier)) {
          return false;
        }
        jobRequestCollectionIdentifiers.push(jobRequestIdentifier);
        return true;
      });
      return [...jobRequestsToAdd, ...jobRequestCollection];
    }
    return jobRequestCollection;
  }

  protected convertDateFromClient(jobRequest: IJobRequest): IJobRequest {
    return Object.assign({}, jobRequest, {
      startTime: jobRequest.startTime?.isValid() ? jobRequest.startTime.toJSON() : undefined,
      endTime: jobRequest.endTime?.isValid() ? jobRequest.endTime.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.startTime = res.body.startTime ? dayjs(res.body.startTime) : undefined;
      res.body.endTime = res.body.endTime ? dayjs(res.body.endTime) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((jobRequest: IJobRequest) => {
        jobRequest.startTime = jobRequest.startTime ? dayjs(jobRequest.startTime) : undefined;
        jobRequest.endTime = jobRequest.endTime ? dayjs(jobRequest.endTime) : undefined;
      });
    }
    return res;
  }
}
