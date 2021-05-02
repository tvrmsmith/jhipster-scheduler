import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IJobRequest } from '../job-request.model';

@Component({
  selector: 'jhi-job-request-detail',
  templateUrl: './job-request-detail.component.html',
})
export class JobRequestDetailComponent implements OnInit {
  jobRequest: IJobRequest | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ jobRequest }) => {
      this.jobRequest = jobRequest;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
