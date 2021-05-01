import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUsState, UsState } from '../us-state.model';

import { UsStateService } from './us-state.service';

describe('Service Tests', () => {
  describe('UsState Service', () => {
    let service: UsStateService;
    let httpMock: HttpTestingController;
    let elemDefault: IUsState;
    let expectedResult: IUsState | IUsState[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(UsStateService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
        abbreviation: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a UsState', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new UsState()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a UsState', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            abbreviation: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a UsState', () => {
        const patchObject = Object.assign(
          {
            name: 'BBBBBB',
          },
          new UsState()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of UsState', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            abbreviation: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a UsState', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addUsStateToCollectionIfMissing', () => {
        it('should add a UsState to an empty array', () => {
          const usState: IUsState = { id: 123 };
          expectedResult = service.addUsStateToCollectionIfMissing([], usState);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(usState);
        });

        it('should not add a UsState to an array that contains it', () => {
          const usState: IUsState = { id: 123 };
          const usStateCollection: IUsState[] = [
            {
              ...usState,
            },
            { id: 456 },
          ];
          expectedResult = service.addUsStateToCollectionIfMissing(usStateCollection, usState);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a UsState to an array that doesn't contain it", () => {
          const usState: IUsState = { id: 123 };
          const usStateCollection: IUsState[] = [{ id: 456 }];
          expectedResult = service.addUsStateToCollectionIfMissing(usStateCollection, usState);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(usState);
        });

        it('should add only unique UsState to an array', () => {
          const usStateArray: IUsState[] = [{ id: 123 }, { id: 456 }, { id: 18780 }];
          const usStateCollection: IUsState[] = [{ id: 123 }];
          expectedResult = service.addUsStateToCollectionIfMissing(usStateCollection, ...usStateArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const usState: IUsState = { id: 123 };
          const usState2: IUsState = { id: 456 };
          expectedResult = service.addUsStateToCollectionIfMissing([], usState, usState2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(usState);
          expect(expectedResult).toContain(usState2);
        });

        it('should accept null and undefined values', () => {
          const usState: IUsState = { id: 123 };
          expectedResult = service.addUsStateToCollectionIfMissing([], null, usState, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(usState);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
