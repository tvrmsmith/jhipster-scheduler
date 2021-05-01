jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { InterpreterService } from '../service/interpreter.service';
import { IInterpreter, Interpreter } from '../interpreter.model';
import { IAddress } from 'app/entities/address/address.model';
import { AddressService } from 'app/entities/address/service/address.service';

import { InterpreterUpdateComponent } from './interpreter-update.component';

describe('Component Tests', () => {
  describe('Interpreter Management Update Component', () => {
    let comp: InterpreterUpdateComponent;
    let fixture: ComponentFixture<InterpreterUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let interpreterService: InterpreterService;
    let addressService: AddressService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [InterpreterUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(InterpreterUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(InterpreterUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      interpreterService = TestBed.inject(InterpreterService);
      addressService = TestBed.inject(AddressService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call address query and add missing value', () => {
        const interpreter: IInterpreter = { id: 456 };
        const address: IAddress = { id: 64624 };
        interpreter.address = address;

        const addressCollection: IAddress[] = [{ id: 78737 }];
        spyOn(addressService, 'query').and.returnValue(of(new HttpResponse({ body: addressCollection })));
        const expectedCollection: IAddress[] = [address, ...addressCollection];
        spyOn(addressService, 'addAddressToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ interpreter });
        comp.ngOnInit();

        expect(addressService.query).toHaveBeenCalled();
        expect(addressService.addAddressToCollectionIfMissing).toHaveBeenCalledWith(addressCollection, address);
        expect(comp.addressesCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const interpreter: IInterpreter = { id: 456 };
        const address: IAddress = { id: 93840 };
        interpreter.address = address;

        activatedRoute.data = of({ interpreter });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(interpreter));
        expect(comp.addressesCollection).toContain(address);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const interpreter = { id: 123 };
        spyOn(interpreterService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ interpreter });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: interpreter }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(interpreterService.update).toHaveBeenCalledWith(interpreter);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const interpreter = new Interpreter();
        spyOn(interpreterService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ interpreter });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: interpreter }));
        saveSubject.complete();

        // THEN
        expect(interpreterService.create).toHaveBeenCalledWith(interpreter);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const interpreter = { id: 123 };
        spyOn(interpreterService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ interpreter });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(interpreterService.update).toHaveBeenCalledWith(interpreter);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackAddressById', () => {
        it('Should return tracked Address primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackAddressById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
