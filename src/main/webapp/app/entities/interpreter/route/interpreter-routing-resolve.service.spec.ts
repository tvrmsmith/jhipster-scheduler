jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IInterpreter, Interpreter } from '../interpreter.model';
import { InterpreterService } from '../service/interpreter.service';

import { InterpreterRoutingResolveService } from './interpreter-routing-resolve.service';

describe('Service Tests', () => {
  describe('Interpreter routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: InterpreterRoutingResolveService;
    let service: InterpreterService;
    let resultInterpreter: IInterpreter | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(InterpreterRoutingResolveService);
      service = TestBed.inject(InterpreterService);
      resultInterpreter = undefined;
    });

    describe('resolve', () => {
      it('should return IInterpreter returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultInterpreter = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultInterpreter).toEqual({ id: 123 });
      });

      it('should return new IInterpreter if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultInterpreter = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultInterpreter).toEqual(new Interpreter());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultInterpreter = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultInterpreter).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
