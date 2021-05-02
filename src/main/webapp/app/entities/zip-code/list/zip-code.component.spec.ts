import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ZipCodeService } from '../service/zip-code.service';

import { ZipCodeComponent } from './zip-code.component';

describe('Component Tests', () => {
  describe('ZipCode Management Component', () => {
    let comp: ZipCodeComponent;
    let fixture: ComponentFixture<ZipCodeComponent>;
    let service: ZipCodeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ZipCodeComponent],
      })
        .overrideTemplate(ZipCodeComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ZipCodeComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ZipCodeService);

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
      expect(comp.zipCodes?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
