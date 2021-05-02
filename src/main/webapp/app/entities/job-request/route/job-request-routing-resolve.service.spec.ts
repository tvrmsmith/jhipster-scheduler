jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IJobRequest, JobRequest } from '../job-request.model';
import { JobRequestService } from '../service/job-request.service';

import { JobRequestRoutingResolveService } from './job-request-routing-resolve.service';

describe('Service Tests', () => {
  describe('JobRequest routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: JobRequestRoutingResolveService;
    let service: JobRequestService;
    let resultJobRequest: IJobRequest | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(JobRequestRoutingResolveService);
      service = TestBed.inject(JobRequestService);
      resultJobRequest = undefined;
    });

    describe('resolve', () => {
      it('should return IJobRequest returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultJobRequest = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultJobRequest).toEqual({ id: 123 });
      });

      it('should return new IJobRequest if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultJobRequest = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultJobRequest).toEqual(new JobRequest());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultJobRequest = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultJobRequest).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
