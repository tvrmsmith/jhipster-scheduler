import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { LanguageService } from '../service/language.service';

import { LanguageComponent } from './language.component';

describe('Component Tests', () => {
  describe('Language Management Component', () => {
    let comp: LanguageComponent;
    let fixture: ComponentFixture<LanguageComponent>;
    let service: LanguageService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [LanguageComponent],
      })
        .overrideTemplate(LanguageComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(LanguageComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(LanguageService);

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
      expect(comp.languages?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
