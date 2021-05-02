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
import { IInterpreter } from 'app/entities/interpreter/interpreter.model';
import { InterpreterService } from 'app/entities/interpreter/service/interpreter.service';
import { ILanguage } from 'app/entities/language/language.model';
import { LanguageService } from 'app/entities/language/service/language.service';
import { ILocation } from 'app/entities/location/location.model';
import { LocationService } from 'app/entities/location/service/location.service';

@Component({
  selector: 'jhi-job-request-update',
  templateUrl: './job-request-update.component.html',
})
export class JobRequestUpdateComponent implements OnInit {
  isSaving = false;

  assignedInterpretersCollection: IInterpreter[] = [];
  languagesCollection: ILanguage[] = [];
  locationsSharedCollection: ILocation[] = [];

  editForm = this.fb.group({
    id: [],
    startTime: [null, [Validators.required]],
    endTime: [null, [Validators.required]],
    assignedInterpreter: [],
    language: [null, Validators.required],
    location: [null, Validators.required],
  });

  constructor(
    protected jobRequestService: JobRequestService,
    protected interpreterService: InterpreterService,
    protected languageService: LanguageService,
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

  trackInterpreterById(index: number, item: IInterpreter): number {
    return item.id!;
  }

  trackLanguageById(index: number, item: ILanguage): number {
    return item.id!;
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
      assignedInterpreter: jobRequest.assignedInterpreter,
      language: jobRequest.language,
      location: jobRequest.location,
    });

    this.assignedInterpretersCollection = this.interpreterService.addInterpreterToCollectionIfMissing(
      this.assignedInterpretersCollection,
      jobRequest.assignedInterpreter
    );
    this.languagesCollection = this.languageService.addLanguageToCollectionIfMissing(this.languagesCollection, jobRequest.language);
    this.locationsSharedCollection = this.locationService.addLocationToCollectionIfMissing(
      this.locationsSharedCollection,
      jobRequest.location
    );
  }

  protected loadRelationshipsOptions(): void {
    this.interpreterService
      .query({ filter: 'jobrequest-is-null' })
      .pipe(map((res: HttpResponse<IInterpreter[]>) => res.body ?? []))
      .pipe(
        map((interpreters: IInterpreter[]) =>
          this.interpreterService.addInterpreterToCollectionIfMissing(interpreters, this.editForm.get('assignedInterpreter')!.value)
        )
      )
      .subscribe((interpreters: IInterpreter[]) => (this.assignedInterpretersCollection = interpreters));

    this.languageService
      .query({ filter: 'jobrequest-is-null' })
      .pipe(map((res: HttpResponse<ILanguage[]>) => res.body ?? []))
      .pipe(
        map((languages: ILanguage[]) =>
          this.languageService.addLanguageToCollectionIfMissing(languages, this.editForm.get('language')!.value)
        )
      )
      .subscribe((languages: ILanguage[]) => (this.languagesCollection = languages));

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
      assignedInterpreter: this.editForm.get(['assignedInterpreter'])!.value,
      language: this.editForm.get(['language'])!.value,
      location: this.editForm.get(['location'])!.value,
    };
  }
}
