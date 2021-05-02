jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { LocationService } from '../service/location.service';
import { ILocation, Location } from '../location.model';
import { IAddress } from 'app/entities/address/address.model';
import { AddressService } from 'app/entities/address/service/address.service';
import { IOrganization } from 'app/entities/organization/organization.model';
import { OrganizationService } from 'app/entities/organization/service/organization.service';

import { LocationUpdateComponent } from './location-update.component';

describe('Component Tests', () => {
  describe('Location Management Update Component', () => {
    let comp: LocationUpdateComponent;
    let fixture: ComponentFixture<LocationUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let locationService: LocationService;
    let addressService: AddressService;
    let organizationService: OrganizationService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [LocationUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(LocationUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(LocationUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      locationService = TestBed.inject(LocationService);
      addressService = TestBed.inject(AddressService);
      organizationService = TestBed.inject(OrganizationService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call address query and add missing value', () => {
        const location: ILocation = { id: 456 };
        const address: IAddress = { id: 75971 };
        location.address = address;

        const addressCollection: IAddress[] = [{ id: 60835 }];
        spyOn(addressService, 'query').and.returnValue(of(new HttpResponse({ body: addressCollection })));
        const expectedCollection: IAddress[] = [address, ...addressCollection];
        spyOn(addressService, 'addAddressToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ location });
        comp.ngOnInit();

        expect(addressService.query).toHaveBeenCalled();
        expect(addressService.addAddressToCollectionIfMissing).toHaveBeenCalledWith(addressCollection, address);
        expect(comp.addressesCollection).toEqual(expectedCollection);
      });

      it('Should call Organization query and add missing value', () => {
        const location: ILocation = { id: 456 };
        const organization: IOrganization = { id: 21657 };
        location.organization = organization;

        const organizationCollection: IOrganization[] = [{ id: 38762 }];
        spyOn(organizationService, 'query').and.returnValue(of(new HttpResponse({ body: organizationCollection })));
        const additionalOrganizations = [organization];
        const expectedCollection: IOrganization[] = [...additionalOrganizations, ...organizationCollection];
        spyOn(organizationService, 'addOrganizationToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ location });
        comp.ngOnInit();

        expect(organizationService.query).toHaveBeenCalled();
        expect(organizationService.addOrganizationToCollectionIfMissing).toHaveBeenCalledWith(
          organizationCollection,
          ...additionalOrganizations
        );
        expect(comp.organizationsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const location: ILocation = { id: 456 };
        const address: IAddress = { id: 20287 };
        location.address = address;
        const organization: IOrganization = { id: 33052 };
        location.organization = organization;

        activatedRoute.data = of({ location });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(location));
        expect(comp.addressesCollection).toContain(address);
        expect(comp.organizationsSharedCollection).toContain(organization);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const location = { id: 123 };
        spyOn(locationService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ location });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: location }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(locationService.update).toHaveBeenCalledWith(location);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const location = new Location();
        spyOn(locationService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ location });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: location }));
        saveSubject.complete();

        // THEN
        expect(locationService.create).toHaveBeenCalledWith(location);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const location = { id: 123 };
        spyOn(locationService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ location });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(locationService.update).toHaveBeenCalledWith(location);
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

      describe('trackOrganizationById', () => {
        it('Should return tracked Organization primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackOrganizationById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
