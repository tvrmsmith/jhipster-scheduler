import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { JobRequestDetailComponent } from './job-request-detail.component';

describe('Component Tests', () => {
  describe('JobRequest Management Detail Component', () => {
    let comp: JobRequestDetailComponent;
    let fixture: ComponentFixture<JobRequestDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [JobRequestDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ jobRequest: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(JobRequestDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(JobRequestDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load jobRequest on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.jobRequest).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
