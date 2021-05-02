jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { OrganizationService } from '../service/organization.service';
import { IOrganization, Organization } from '../organization.model';

import { OrganizationUpdateComponent } from './organization-update.component';

describe('Component Tests', () => {
  describe('Organization Management Update Component', () => {
    let comp: OrganizationUpdateComponent;
    let fixture: ComponentFixture<OrganizationUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let organizationService: OrganizationService;

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

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const organization: IOrganization = { id: 456 };

        activatedRoute.data = of({ organization });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(organization));
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
  });
});
