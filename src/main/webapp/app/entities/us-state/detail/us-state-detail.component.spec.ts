import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UsStateDetailComponent } from './us-state-detail.component';

describe('Component Tests', () => {
  describe('UsState Management Detail Component', () => {
    let comp: UsStateDetailComponent;
    let fixture: ComponentFixture<UsStateDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [UsStateDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ usState: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(UsStateDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(UsStateDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load usState on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.usState).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
