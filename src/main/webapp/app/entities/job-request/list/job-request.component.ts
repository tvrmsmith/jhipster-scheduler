import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IJobRequest } from '../job-request.model';
import { JobRequestService } from '../service/job-request.service';
import { JobRequestDeleteDialogComponent } from '../delete/job-request-delete-dialog.component';

@Component({
  selector: 'jhi-job-request',
  templateUrl: './job-request.component.html',
})
export class JobRequestComponent implements OnInit {
  jobRequests?: IJobRequest[];
  isLoading = false;

  constructor(protected jobRequestService: JobRequestService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.jobRequestService.query().subscribe(
      (res: HttpResponse<IJobRequest[]>) => {
        this.isLoading = false;
        this.jobRequests = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IJobRequest): number {
    return item.id!;
  }

  delete(jobRequest: IJobRequest): void {
    const modalRef = this.modalService.open(JobRequestDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.jobRequest = jobRequest;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
