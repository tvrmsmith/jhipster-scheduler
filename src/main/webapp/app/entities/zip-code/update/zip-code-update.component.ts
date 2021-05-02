import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IZipCode, ZipCode } from '../zip-code.model';
import { ZipCodeService } from '../service/zip-code.service';

@Component({
  selector: 'jhi-zip-code-update',
  templateUrl: './zip-code-update.component.html',
})
export class ZipCodeUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    value: [null, [Validators.required, Validators.pattern('^\\d{5}$')]],
  });

  constructor(protected zipCodeService: ZipCodeService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ zipCode }) => {
      this.updateForm(zipCode);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const zipCode = this.createFromForm();
    if (zipCode.id !== undefined) {
      this.subscribeToSaveResponse(this.zipCodeService.update(zipCode));
    } else {
      this.subscribeToSaveResponse(this.zipCodeService.create(zipCode));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IZipCode>>): void {
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

  protected updateForm(zipCode: IZipCode): void {
    this.editForm.patchValue({
      id: zipCode.id,
      value: zipCode.value,
    });
  }

  protected createFromForm(): IZipCode {
    return {
      ...new ZipCode(),
      id: this.editForm.get(['id'])!.value,
      value: this.editForm.get(['value'])!.value,
    };
  }
}
