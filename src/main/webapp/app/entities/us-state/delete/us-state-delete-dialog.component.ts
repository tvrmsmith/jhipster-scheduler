import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IUsState } from '../us-state.model';
import { UsStateService } from '../service/us-state.service';

@Component({
  templateUrl: './us-state-delete-dialog.component.html',
})
export class UsStateDeleteDialogComponent {
  usState?: IUsState;

  constructor(protected usStateService: UsStateService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.usStateService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
