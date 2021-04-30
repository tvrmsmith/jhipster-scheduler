import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IUsState, UsState } from '../us-state.model';
import { UsStateService } from '../service/us-state.service';

@Component({
  selector: 'jhi-us-state-update',
  templateUrl: './us-state-update.component.html',
})
export class UsStateUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    abbreviation: [null, [Validators.required, Validators.pattern('^[A-Z]{2}$')]],
  });

  constructor(protected usStateService: UsStateService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ usState }) => {
      this.updateForm(usState);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const usState = this.createFromForm();
    if (usState.id !== undefined) {
      this.subscribeToSaveResponse(this.usStateService.update(usState));
    } else {
      this.subscribeToSaveResponse(this.usStateService.create(usState));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUsState>>): void {
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

  protected updateForm(usState: IUsState): void {
    this.editForm.patchValue({
      id: usState.id,
      name: usState.name,
      abbreviation: usState.abbreviation,
    });
  }

  protected createFromForm(): IUsState {
    return {
      ...new UsState(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      abbreviation: this.editForm.get(['abbreviation'])!.value,
    };
  }
}
