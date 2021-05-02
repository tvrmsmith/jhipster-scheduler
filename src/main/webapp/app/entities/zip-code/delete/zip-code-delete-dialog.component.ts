import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IZipCode } from '../zip-code.model';
import { ZipCodeService } from '../service/zip-code.service';

@Component({
  templateUrl: './zip-code-delete-dialog.component.html',
})
export class ZipCodeDeleteDialogComponent {
  zipCode?: IZipCode;

  constructor(protected zipCodeService: ZipCodeService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.zipCodeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
