jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { JobRequestService } from '../service/job-request.service';
import { IJobRequest, JobRequest } from '../job-request.model';
import { IInterpreter } from 'app/entities/interpreter/interpreter.model';
import { InterpreterService } from 'app/entities/interpreter/service/interpreter.service';
import { ILanguage } from 'app/entities/language/language.model';
import { LanguageService } from 'app/entities/language/service/language.service';
import { ILocation } from 'app/entities/location/location.model';
import { LocationService } from 'app/entities/location/service/location.service';

import { JobRequestUpdateComponent } from './job-request-update.component';

describe('Component Tests', () => {
  describe('JobRequest Management Update Component', () => {
    let comp: JobRequestUpdateComponent;
    let fixture: ComponentFixture<JobRequestUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let jobRequestService: JobRequestService;
    let interpreterService: InterpreterService;
    let languageService: LanguageService;
    let locationService: LocationService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [JobRequestUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(JobRequestUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(JobRequestUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      jobRequestService = TestBed.inject(JobRequestService);
      interpreterService = TestBed.inject(InterpreterService);
      languageService = TestBed.inject(LanguageService);
      locationService = TestBed.inject(LocationService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call assignedInterpreter query and add missing value', () => {
        const jobRequest: IJobRequest = { id: 456 };
        const assignedInterpreter: IInterpreter = { id: 95882 };
        jobRequest.assignedInterpreter = assignedInterpreter;

        const assignedInterpreterCollection: IInterpreter[] = [{ id: 59691 }];
        spyOn(interpreterService, 'query').and.returnValue(of(new HttpResponse({ body: assignedInterpreterCollection })));
        const expectedCollection: IInterpreter[] = [assignedInterpreter, ...assignedInterpreterCollection];
        spyOn(interpreterService, 'addInterpreterToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ jobRequest });
        comp.ngOnInit();

        expect(interpreterService.query).toHaveBeenCalled();
        expect(interpreterService.addInterpreterToCollectionIfMissing).toHaveBeenCalledWith(
          assignedInterpreterCollection,
          assignedInterpreter
        );
        expect(comp.assignedInterpretersCollection).toEqual(expectedCollection);
      });

      it('Should call language query and add missing value', () => {
        const jobRequest: IJobRequest = { id: 456 };
        const language: ILanguage = { id: 80069 };
        jobRequest.language = language;

        const languageCollection: ILanguage[] = [{ id: 46670 }];
        spyOn(languageService, 'query').and.returnValue(of(new HttpResponse({ body: languageCollection })));
        const expectedCollection: ILanguage[] = [language, ...languageCollection];
        spyOn(languageService, 'addLanguageToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ jobRequest });
        comp.ngOnInit();

        expect(languageService.query).toHaveBeenCalled();
        expect(languageService.addLanguageToCollectionIfMissing).toHaveBeenCalledWith(languageCollection, language);
        expect(comp.languagesCollection).toEqual(expectedCollection);
      });

      it('Should call Location query and add missing value', () => {
        const jobRequest: IJobRequest = { id: 456 };
        const location: ILocation = { id: 12080 };
        jobRequest.location = location;

        const locationCollection: ILocation[] = [{ id: 50391 }];
        spyOn(locationService, 'query').and.returnValue(of(new HttpResponse({ body: locationCollection })));
        const additionalLocations = [location];
        const expectedCollection: ILocation[] = [...additionalLocations, ...locationCollection];
        spyOn(locationService, 'addLocationToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ jobRequest });
        comp.ngOnInit();

        expect(locationService.query).toHaveBeenCalled();
        expect(locationService.addLocationToCollectionIfMissing).toHaveBeenCalledWith(locationCollection, ...additionalLocations);
        expect(comp.locationsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const jobRequest: IJobRequest = { id: 456 };
        const assignedInterpreter: IInterpreter = { id: 88124 };
        jobRequest.assignedInterpreter = assignedInterpreter;
        const language: ILanguage = { id: 80205 };
        jobRequest.language = language;
        const location: ILocation = { id: 27617 };
        jobRequest.location = location;

        activatedRoute.data = of({ jobRequest });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(jobRequest));
        expect(comp.assignedInterpretersCollection).toContain(assignedInterpreter);
        expect(comp.languagesCollection).toContain(language);
        expect(comp.locationsSharedCollection).toContain(location);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const jobRequest = { id: 123 };
        spyOn(jobRequestService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ jobRequest });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: jobRequest }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(jobRequestService.update).toHaveBeenCalledWith(jobRequest);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const jobRequest = new JobRequest();
        spyOn(jobRequestService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ jobRequest });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: jobRequest }));
        saveSubject.complete();

        // THEN
        expect(jobRequestService.create).toHaveBeenCalledWith(jobRequest);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const jobRequest = { id: 123 };
        spyOn(jobRequestService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ jobRequest });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(jobRequestService.update).toHaveBeenCalledWith(jobRequest);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackInterpreterById', () => {
        it('Should return tracked Interpreter primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackInterpreterById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackLanguageById', () => {
        it('Should return tracked Language primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackLanguageById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackLocationById', () => {
        it('Should return tracked Location primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackLocationById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
