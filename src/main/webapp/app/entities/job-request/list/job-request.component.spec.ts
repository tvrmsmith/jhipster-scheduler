import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { JobRequestService } from '../service/job-request.service';

import { JobRequestComponent } from './job-request.component';

describe('Component Tests', () => {
  describe('JobRequest Management Component', () => {
    let comp: JobRequestComponent;
    let fixture: ComponentFixture<JobRequestComponent>;
    let service: JobRequestService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [JobRequestComponent],
      })
        .overrideTemplate(JobRequestComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(JobRequestComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(JobRequestService);

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
      expect(comp.jobRequests?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
