import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IJobRequest, JobRequest } from '../job-request.model';
import { JobRequestService } from '../service/job-request.service';
import { ILocation } from 'app/entities/location/location.model';
import { LocationService } from 'app/entities/location/service/location.service';

@Component({
  selector: 'jhi-job-request-update',
  templateUrl: './job-request-update.component.html',
})
export class JobRequestUpdateComponent implements OnInit {
  isSaving = false;

  locationsSharedCollection: ILocation[] = [];

  editForm = this.fb.group({
    id: [],
    startTime: [null, [Validators.required]],
    endTime: [null, [Validators.required]],
    location: [null, Validators.required],
  });

  constructor(
    protected jobRequestService: JobRequestService,
    protected locationService: LocationService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ jobRequest }) => {
      if (jobRequest.id === undefined) {
        const today = dayjs().startOf('day');
        jobRequest.startTime = today;
        jobRequest.endTime = today;
      }

      this.updateForm(jobRequest);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const jobRequest = this.createFromForm();
    if (jobRequest.id !== undefined) {
      this.subscribeToSaveResponse(this.jobRequestService.update(jobRequest));
    } else {
      this.subscribeToSaveResponse(this.jobRequestService.create(jobRequest));
    }
  }

  trackLocationById(index: number, item: ILocation): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJobRequest>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(jobRequest: IJobRequest): void {
    this.editForm.patchValue({
      id: jobRequest.id,
      startTime: jobRequest.startTime ? jobRequest.startTime.format(DATE_TIME_FORMAT) : null,
      endTime: jobRequest.endTime ? jobRequest.endTime.format(DATE_TIME_FORMAT) : null,
      location: jobRequest.location,
    });

    this.locationsSharedCollection = this.locationService.addLocationToCollectionIfMissing(
      this.locationsSharedCollection,
      jobRequest.location
    );
  }

  protected loadRelationshipsOptions(): void {
    this.locationService
      .query()
      .pipe(map((res: HttpResponse<ILocation[]>) => res.body ?? []))
      .pipe(
        map((locations: ILocation[]) =>
          this.locationService.addLocationToCollectionIfMissing(locations, this.editForm.get('location')!.value)
        )
      )
      .subscribe((locations: ILocation[]) => (this.locationsSharedCollection = locations));
  }

  protected createFromForm(): IJobRequest {
    return {
      ...new JobRequest(),
      id: this.editForm.get(['id'])!.value,
      startTime: this.editForm.get(['startTime'])!.value ? dayjs(this.editForm.get(['startTime'])!.value, DATE_TIME_FORMAT) : undefined,
      endTime: this.editForm.get(['endTime'])!.value ? dayjs(this.editForm.get(['endTime'])!.value, DATE_TIME_FORMAT) : undefined,
      location: this.editForm.get(['location'])!.value,
    };
  }
}
