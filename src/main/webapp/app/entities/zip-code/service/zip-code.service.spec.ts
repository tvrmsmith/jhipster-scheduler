import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IZipCode, ZipCode } from '../zip-code.model';

import { ZipCodeService } from './zip-code.service';

describe('Service Tests', () => {
  describe('ZipCode Service', () => {
    let service: ZipCodeService;
    let httpMock: HttpTestingController;
    let elemDefault: IZipCode;
    let expectedResult: IZipCode | IZipCode[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ZipCodeService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        value: 'AAAAAAA',
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

      it('should create a ZipCode', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new ZipCode()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a ZipCode', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            value: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a ZipCode', () => {
        const patchObject = Object.assign(
          {
            value: 'BBBBBB',
          },
          new ZipCode()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of ZipCode', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            value: 'BBBBBB',
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

      it('should delete a ZipCode', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addZipCodeToCollectionIfMissing', () => {
        it('should add a ZipCode to an empty array', () => {
          const zipCode: IZipCode = { id: 123 };
          expectedResult = service.addZipCodeToCollectionIfMissing([], zipCode);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(zipCode);
        });

        it('should not add a ZipCode to an array that contains it', () => {
          const zipCode: IZipCode = { id: 123 };
          const zipCodeCollection: IZipCode[] = [
            {
              ...zipCode,
            },
            { id: 456 },
          ];
          expectedResult = service.addZipCodeToCollectionIfMissing(zipCodeCollection, zipCode);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a ZipCode to an array that doesn't contain it", () => {
          const zipCode: IZipCode = { id: 123 };
          const zipCodeCollection: IZipCode[] = [{ id: 456 }];
          expectedResult = service.addZipCodeToCollectionIfMissing(zipCodeCollection, zipCode);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(zipCode);
        });

        it('should add only unique ZipCode to an array', () => {
          const zipCodeArray: IZipCode[] = [{ id: 123 }, { id: 456 }, { id: 94576 }];
          const zipCodeCollection: IZipCode[] = [{ id: 123 }];
          expectedResult = service.addZipCodeToCollectionIfMissing(zipCodeCollection, ...zipCodeArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const zipCode: IZipCode = { id: 123 };
          const zipCode2: IZipCode = { id: 456 };
          expectedResult = service.addZipCodeToCollectionIfMissing([], zipCode, zipCode2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(zipCode);
          expect(expectedResult).toContain(zipCode2);
        });

        it('should accept null and undefined values', () => {
          const zipCode: IZipCode = { id: 123 };
          expectedResult = service.addZipCodeToCollectionIfMissing([], null, zipCode, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(zipCode);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
