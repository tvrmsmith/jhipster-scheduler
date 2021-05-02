jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AddressService } from '../service/address.service';
import { IAddress, Address } from '../address.model';
import { IUsState } from 'app/entities/us-state/us-state.model';
import { UsStateService } from 'app/entities/us-state/service/us-state.service';
import { IZipCode } from 'app/entities/zip-code/zip-code.model';
import { ZipCodeService } from 'app/entities/zip-code/service/zip-code.service';

import { AddressUpdateComponent } from './address-update.component';

describe('Component Tests', () => {
  describe('Address Management Update Component', () => {
    let comp: AddressUpdateComponent;
    let fixture: ComponentFixture<AddressUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let addressService: AddressService;
    let usStateService: UsStateService;
    let zipCodeService: ZipCodeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AddressUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(AddressUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AddressUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      addressService = TestBed.inject(AddressService);
      usStateService = TestBed.inject(UsStateService);
      zipCodeService = TestBed.inject(ZipCodeService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call UsState query and add missing value', () => {
        const address: IAddress = { id: 456 };
        const state: IUsState = { id: 75107 };
        address.state = state;

        const usStateCollection: IUsState[] = [{ id: 58349 }];
        spyOn(usStateService, 'query').and.returnValue(of(new HttpResponse({ body: usStateCollection })));
        const additionalUsStates = [state];
        const expectedCollection: IUsState[] = [...additionalUsStates, ...usStateCollection];
        spyOn(usStateService, 'addUsStateToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ address });
        comp.ngOnInit();

        expect(usStateService.query).toHaveBeenCalled();
        expect(usStateService.addUsStateToCollectionIfMissing).toHaveBeenCalledWith(usStateCollection, ...additionalUsStates);
        expect(comp.usStatesSharedCollection).toEqual(expectedCollection);
      });

      it('Should call ZipCode query and add missing value', () => {
        const address: IAddress = { id: 456 };
        const zipCode: IZipCode = { id: 68803 };
        address.zipCode = zipCode;

        const zipCodeCollection: IZipCode[] = [{ id: 5422 }];
        spyOn(zipCodeService, 'query').and.returnValue(of(new HttpResponse({ body: zipCodeCollection })));
        const additionalZipCodes = [zipCode];
        const expectedCollection: IZipCode[] = [...additionalZipCodes, ...zipCodeCollection];
        spyOn(zipCodeService, 'addZipCodeToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ address });
        comp.ngOnInit();

        expect(zipCodeService.query).toHaveBeenCalled();
        expect(zipCodeService.addZipCodeToCollectionIfMissing).toHaveBeenCalledWith(zipCodeCollection, ...additionalZipCodes);
        expect(comp.zipCodesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const address: IAddress = { id: 456 };
        const state: IUsState = { id: 65239 };
        address.state = state;
        const zipCode: IZipCode = { id: 70475 };
        address.zipCode = zipCode;

        activatedRoute.data = of({ address });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(address));
        expect(comp.usStatesSharedCollection).toContain(state);
        expect(comp.zipCodesSharedCollection).toContain(zipCode);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const address = { id: 123 };
        spyOn(addressService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ address });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: address }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(addressService.update).toHaveBeenCalledWith(address);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const address = new Address();
        spyOn(addressService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ address });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: address }));
        saveSubject.complete();

        // THEN
        expect(addressService.create).toHaveBeenCalledWith(address);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const address = { id: 123 };
        spyOn(addressService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ address });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(addressService.update).toHaveBeenCalledWith(address);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackUsStateById', () => {
        it('Should return tracked UsState primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackUsStateById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackZipCodeById', () => {
        it('Should return tracked ZipCode primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackZipCodeById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
