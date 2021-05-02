import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ILanguage } from '../language.model';
import { LanguageService } from '../service/language.service';
import { LanguageDeleteDialogComponent } from '../delete/language-delete-dialog.component';

@Component({
  selector: 'jhi-language',
  templateUrl: './language.component.html',
})
export class LanguageComponent implements OnInit {
  languages?: ILanguage[];
  isLoading = false;

  constructor(protected languageService: LanguageService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.languageService.query().subscribe(
      (res: HttpResponse<ILanguage[]>) => {
        this.isLoading = false;
        this.languages = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ILanguage): number {
    return item.id!;
  }

  delete(language: ILanguage): void {
    const modalRef = this.modalService.open(LanguageDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.language = language;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
