import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAddress } from '../address.model';
import { AddressService } from '../service/address.service';

@Component({
  templateUrl: './address-delete-dialog.component.html',
})
export class AddressDeleteDialogComponent {
  address?: IAddress;

  constructor(protected addressService: AddressService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.addressService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
