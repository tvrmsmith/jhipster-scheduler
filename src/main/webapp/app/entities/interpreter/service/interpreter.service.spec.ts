import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IInterpreter, Interpreter } from '../interpreter.model';

import { InterpreterService } from './interpreter.service';

describe('Service Tests', () => {
  describe('Interpreter Service', () => {
    let service: InterpreterService;
    let httpMock: HttpTestingController;
    let elemDefault: IInterpreter;
    let expectedResult: IInterpreter | IInterpreter[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(InterpreterService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        firstName: 'AAAAAAA',
        lastName: 'AAAAAAA',
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

      it('should create a Interpreter', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Interpreter()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Interpreter', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            firstName: 'BBBBBB',
            lastName: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Interpreter', () => {
        const patchObject = Object.assign(
          {
            firstName: 'BBBBBB',
          },
          new Interpreter()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Interpreter', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            firstName: 'BBBBBB',
            lastName: 'BBBBBB',
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

      it('should delete a Interpreter', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addInterpreterToCollectionIfMissing', () => {
        it('should add a Interpreter to an empty array', () => {
          const interpreter: IInterpreter = { id: 123 };
          expectedResult = service.addInterpreterToCollectionIfMissing([], interpreter);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(interpreter);
        });

        it('should not add a Interpreter to an array that contains it', () => {
          const interpreter: IInterpreter = { id: 123 };
          const interpreterCollection: IInterpreter[] = [
            {
              ...interpreter,
            },
            { id: 456 },
          ];
          expectedResult = service.addInterpreterToCollectionIfMissing(interpreterCollection, interpreter);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Interpreter to an array that doesn't contain it", () => {
          const interpreter: IInterpreter = { id: 123 };
          const interpreterCollection: IInterpreter[] = [{ id: 456 }];
          expectedResult = service.addInterpreterToCollectionIfMissing(interpreterCollection, interpreter);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(interpreter);
        });

        it('should add only unique Interpreter to an array', () => {
          const interpreterArray: IInterpreter[] = [{ id: 123 }, { id: 456 }, { id: 92776 }];
          const interpreterCollection: IInterpreter[] = [{ id: 123 }];
          expectedResult = service.addInterpreterToCollectionIfMissing(interpreterCollection, ...interpreterArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const interpreter: IInterpreter = { id: 123 };
          const interpreter2: IInterpreter = { id: 456 };
          expectedResult = service.addInterpreterToCollectionIfMissing([], interpreter, interpreter2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(interpreter);
          expect(expectedResult).toContain(interpreter2);
        });

        it('should accept null and undefined values', () => {
          const interpreter: IInterpreter = { id: 123 };
          expectedResult = service.addInterpreterToCollectionIfMissing([], null, interpreter, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(interpreter);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
