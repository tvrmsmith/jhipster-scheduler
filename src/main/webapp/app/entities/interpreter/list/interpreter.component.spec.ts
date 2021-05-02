import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { InterpreterService } from '../service/interpreter.service';

import { InterpreterComponent } from './interpreter.component';

describe('Component Tests', () => {
  describe('Interpreter Management Component', () => {
    let comp: InterpreterComponent;
    let fixture: ComponentFixture<InterpreterComponent>;
    let service: InterpreterService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [InterpreterComponent],
      })
        .overrideTemplate(InterpreterComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(InterpreterComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(InterpreterService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.interpreters?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
