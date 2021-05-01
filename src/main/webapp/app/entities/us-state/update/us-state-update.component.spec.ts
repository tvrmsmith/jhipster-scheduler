jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { UsStateService } from '../service/us-state.service';
import { IUsState, UsState } from '../us-state.model';

import { UsStateUpdateComponent } from './us-state-update.component';

describe('Component Tests', () => {
  describe('UsState Management Update Component', () => {
    let comp: UsStateUpdateComponent;
    let fixture: ComponentFixture<UsStateUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let usStateService: UsStateService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [UsStateUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(UsStateUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(UsStateUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      usStateService = TestBed.inject(UsStateService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const usState: IUsState = { id: 456 };

        activatedRoute.data = of({ usState });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(usState));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const usState = { id: 123 };
        spyOn(usStateService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ usState });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: usState }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(usStateService.update).toHaveBeenCalledWith(usState);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const usState = new UsState();
        spyOn(usStateService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ usState });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: usState }));
        saveSubject.complete();

        // THEN
        expect(usStateService.create).toHaveBeenCalledWith(usState);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const usState = { id: 123 };
        spyOn(usStateService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ usState });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(usStateService.update).toHaveBeenCalledWith(usState);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
