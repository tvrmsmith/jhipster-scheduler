import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IZipCode } from '../zip-code.model';
import { ZipCodeService } from '../service/zip-code.service';
import { ZipCodeDeleteDialogComponent } from '../delete/zip-code-delete-dialog.component';

@Component({
  selector: 'jhi-zip-code',
  templateUrl: './zip-code.component.html',
})
export class ZipCodeComponent implements OnInit {
  zipCodes?: IZipCode[];
  isLoading = false;

  constructor(protected zipCodeService: ZipCodeService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.zipCodeService.query().subscribe(
      (res: HttpResponse<IZipCode[]>) => {
        this.isLoading = false;
        this.zipCodes = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IZipCode): number {
    return item.id!;
  }

  delete(zipCode: IZipCode): void {
    const modalRef = this.modalService.open(ZipCodeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.zipCode = zipCode;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
