import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IJobRequest, JobRequest } from '../job-request.model';

import { JobRequestService } from './job-request.service';

describe('Service Tests', () => {
  describe('JobRequest Service', () => {
    let service: JobRequestService;
    let httpMock: HttpTestingController;
    let elemDefault: IJobRequest;
    let expectedResult: IJobRequest | IJobRequest[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(JobRequestService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        startTime: currentDate,
        endTime: currentDate,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            startTime: currentDate.format(DATE_TIME_FORMAT),
            endTime: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a JobRequest', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            startTime: currentDate.format(DATE_TIME_FORMAT),
            endTime: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            startTime: currentDate,
            endTime: currentDate,
          },
          returnedFromService
        );

        service.create(new JobRequest()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a JobRequest', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            startTime: currentDate.format(DATE_TIME_FORMAT),
            endTime: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            startTime: currentDate,
            endTime: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a JobRequest', () => {
        const patchObject = Object.assign(
          {
            startTime: currentDate.format(DATE_TIME_FORMAT),
          },
          new JobRequest()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            startTime: currentDate,
            endTime: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of JobRequest', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            startTime: currentDate.format(DATE_TIME_FORMAT),
            endTime: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            startTime: currentDate,
            endTime: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a JobRequest', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addJobRequestToCollectionIfMissing', () => {
        it('should add a JobRequest to an empty array', () => {
          const jobRequest: IJobRequest = { id: 123 };
          expectedResult = service.addJobRequestToCollectionIfMissing([], jobRequest);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(jobRequest);
        });

        it('should not add a JobRequest to an array that contains it', () => {
          const jobRequest: IJobRequest = { id: 123 };
          const jobRequestCollection: IJobRequest[] = [
            {
              ...jobRequest,
            },
            { id: 456 },
          ];
          expectedResult = service.addJobRequestToCollectionIfMissing(jobRequestCollection, jobRequest);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a JobRequest to an array that doesn't contain it", () => {
          const jobRequest: IJobRequest = { id: 123 };
          const jobRequestCollection: IJobRequest[] = [{ id: 456 }];
          expectedResult = service.addJobRequestToCollectionIfMissing(jobRequestCollection, jobRequest);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(jobRequest);
        });

        it('should add only unique JobRequest to an array', () => {
          const jobRequestArray: IJobRequest[] = [{ id: 123 }, { id: 456 }, { id: 21424 }];
          const jobRequestCollection: IJobRequest[] = [{ id: 123 }];
          expectedResult = service.addJobRequestToCollectionIfMissing(jobRequestCollection, ...jobRequestArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const jobRequest: IJobRequest = { id: 123 };
          const jobRequest2: IJobRequest = { id: 456 };
          expectedResult = service.addJobRequestToCollectionIfMissing([], jobRequest, jobRequest2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(jobRequest);
          expect(expectedResult).toContain(jobRequest2);
        });

        it('should accept null and undefined values', () => {
          const jobRequest: IJobRequest = { id: 123 };
          expectedResult = service.addJobRequestToCollectionIfMissing([], null, jobRequest, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(jobRequest);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
