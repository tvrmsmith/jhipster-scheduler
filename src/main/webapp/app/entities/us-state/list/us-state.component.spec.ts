import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { UsStateService } from '../service/us-state.service';

import { UsStateComponent } from './us-state.component';

describe('Component Tests', () => {
  describe('UsState Management Component', () => {
    let comp: UsStateComponent;
    let fixture: ComponentFixture<UsStateComponent>;
    let service: UsStateService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [UsStateComponent],
      })
        .overrideTemplate(UsStateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(UsStateComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(UsStateService);

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
      expect(comp.usStates?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
