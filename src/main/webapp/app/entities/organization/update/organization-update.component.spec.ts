jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { OrganizationService } from '../service/organization.service';
import { IOrganization, Organization } from '../organization.model';
import { IAddress } from 'app/entities/address/address.model';
import { AddressService } from 'app/entities/address/service/address.service';

import { OrganizationUpdateComponent } from './organization-update.component';

describe('Component Tests', () => {
  describe('Organization Management Update Component', () => {
    let comp: OrganizationUpdateComponent;
    let fixture: ComponentFixture<OrganizationUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let organizationService: OrganizationService;
    let addressService: AddressService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [OrganizationUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(OrganizationUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OrganizationUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      organizationService = TestBed.inject(OrganizationService);
      addressService = TestBed.inject(AddressService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call address query and add missing value', () => {
        const organization: IOrganization = { id: 456 };
        const address: IAddress = { id: 64624 };
        organization.address = address;

        const addressCollection: IAddress[] = [{ id: 78737 }];
        spyOn(addressService, 'query').and.returnValue(of(new HttpResponse({ body: addressCollection })));
        const expectedCollection: IAddress[] = [address, ...addressCollection];
        spyOn(addressService, 'addAddressToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ organization });
        comp.ngOnInit();

        expect(addressService.query).toHaveBeenCalled();
        expect(addressService.addAddressToCollectionIfMissing).toHaveBeenCalledWith(addressCollection, address);
        expect(comp.addressesCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const organization: IOrganization = { id: 456 };
        const address: IAddress = { id: 93840 };
        organization.address = address;

        activatedRoute.data = of({ organization });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(organization));
        expect(comp.addressesCollection).toContain(address);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const organization = { id: 123 };
        spyOn(organizationService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ organization });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: organization }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(organizationService.update).toHaveBeenCalledWith(organization);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const organization = new Organization();
        spyOn(organizationService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ organization });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: organization }));
        saveSubject.complete();

        // THEN
        expect(organizationService.create).toHaveBeenCalledWith(organization);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const organization = { id: 123 };
        spyOn(organizationService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ organization });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(organizationService.update).toHaveBeenCalledWith(organization);
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
