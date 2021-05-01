jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ZipCodeService } from '../service/zip-code.service';
import { IZipCode, ZipCode } from '../zip-code.model';

import { ZipCodeUpdateComponent } from './zip-code-update.component';

describe('Component Tests', () => {
  describe('ZipCode Management Update Component', () => {
    let comp: ZipCodeUpdateComponent;
    let fixture: ComponentFixture<ZipCodeUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let zipCodeService: ZipCodeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ZipCodeUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ZipCodeUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ZipCodeUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      zipCodeService = TestBed.inject(ZipCodeService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const zipCode: IZipCode = { id: 456 };

        activatedRoute.data = of({ zipCode });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(zipCode));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const zipCode = { id: 123 };
        spyOn(zipCodeService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ zipCode });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: zipCode }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(zipCodeService.update).toHaveBeenCalledWith(zipCode);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const zipCode = new ZipCode();
        spyOn(zipCodeService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ zipCode });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: zipCode }));
        saveSubject.complete();

        // THEN
        expect(zipCodeService.create).toHaveBeenCalledWith(zipCode);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const zipCode = { id: 123 };
        spyOn(zipCodeService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ zipCode });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(zipCodeService.update).toHaveBeenCalledWith(zipCode);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
