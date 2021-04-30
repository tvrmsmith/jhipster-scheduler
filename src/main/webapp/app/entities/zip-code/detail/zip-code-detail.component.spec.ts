import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ZipCodeDetailComponent } from './zip-code-detail.component';

describe('Component Tests', () => {
  describe('ZipCode Management Detail Component', () => {
    let comp: ZipCodeDetailComponent;
    let fixture: ComponentFixture<ZipCodeDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ZipCodeDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ zipCode: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ZipCodeDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ZipCodeDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load zipCode on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.zipCode).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
