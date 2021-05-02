import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IJobRequest } from '../job-request.model';
import { JobRequestService } from '../service/job-request.service';

@Component({
  templateUrl: './job-request-delete-dialog.component.html',
})
export class JobRequestDeleteDialogComponent {
  jobRequest?: IJobRequest;

  constructor(protected jobRequestService: JobRequestService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.jobRequestService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
