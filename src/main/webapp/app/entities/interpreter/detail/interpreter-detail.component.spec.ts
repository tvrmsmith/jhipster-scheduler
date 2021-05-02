import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { InterpreterDetailComponent } from './interpreter-detail.component';

describe('Component Tests', () => {
  describe('Interpreter Management Detail Component', () => {
    let comp: InterpreterDetailComponent;
    let fixture: ComponentFixture<InterpreterDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [InterpreterDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ interpreter: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(InterpreterDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(InterpreterDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load interpreter on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.interpreter).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
