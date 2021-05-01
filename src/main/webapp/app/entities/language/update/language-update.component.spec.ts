jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { LanguageService } from '../service/language.service';
import { ILanguage, Language } from '../language.model';
import { IInterpreter } from 'app/entities/interpreter/interpreter.model';
import { InterpreterService } from 'app/entities/interpreter/service/interpreter.service';

import { LanguageUpdateComponent } from './language-update.component';

describe('Component Tests', () => {
  describe('Language Management Update Component', () => {
    let comp: LanguageUpdateComponent;
    let fixture: ComponentFixture<LanguageUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let languageService: LanguageService;
    let interpreterService: InterpreterService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [LanguageUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(LanguageUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(LanguageUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      languageService = TestBed.inject(LanguageService);
      interpreterService = TestBed.inject(InterpreterService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Interpreter query and add missing value', () => {
        const language: ILanguage = { id: 456 };
        const interpreter: IInterpreter = { id: 95882 };
        language.interpreter = interpreter;

        const interpreterCollection: IInterpreter[] = [{ id: 59691 }];
        spyOn(interpreterService, 'query').and.returnValue(of(new HttpResponse({ body: interpreterCollection })));
        const additionalInterpreters = [interpreter];
        const expectedCollection: IInterpreter[] = [...additionalInterpreters, ...interpreterCollection];
        spyOn(interpreterService, 'addInterpreterToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ language });
        comp.ngOnInit();

        expect(interpreterService.query).toHaveBeenCalled();
        expect(interpreterService.addInterpreterToCollectionIfMissing).toHaveBeenCalledWith(
          interpreterCollection,
          ...additionalInterpreters
        );
        expect(comp.interpretersSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const language: ILanguage = { id: 456 };
        const interpreter: IInterpreter = { id: 88124 };
        language.interpreter = interpreter;

        activatedRoute.data = of({ language });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(language));
        expect(comp.interpretersSharedCollection).toContain(interpreter);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const language = { id: 123 };
        spyOn(languageService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ language });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: language }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(languageService.update).toHaveBeenCalledWith(language);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const language = new Language();
        spyOn(languageService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ language });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: language }));
        saveSubject.complete();

        // THEN
        expect(languageService.create).toHaveBeenCalledWith(language);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const language = { id: 123 };
        spyOn(languageService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ language });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(languageService.update).toHaveBeenCalledWith(language);
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
    });
  });
});
