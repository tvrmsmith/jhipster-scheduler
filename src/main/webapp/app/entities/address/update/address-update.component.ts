import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAddress, Address } from '../address.model';
import { AddressService } from '../service/address.service';
import { IUsState } from 'app/entities/us-state/us-state.model';
import { UsStateService } from 'app/entities/us-state/service/us-state.service';
import { IZipCode } from 'app/entities/zip-code/zip-code.model';
import { ZipCodeService } from 'app/entities/zip-code/service/zip-code.service';

@Component({
  selector: 'jhi-address-update',
  templateUrl: './address-update.component.html',
})
export class AddressUpdateComponent implements OnInit {
  isSaving = false;

  usStatesSharedCollection: IUsState[] = [];
  zipCodesSharedCollection: IZipCode[] = [];

  editForm = this.fb.group({
    id: [],
    line1: [null, [Validators.required]],
    line2: [],
    city: [null, [Validators.required]],
    state: [null, Validators.required],
    zipCode: [null, Validators.required],
  });

  constructor(
    protected addressService: AddressService,
    protected usStateService: UsStateService,
    protected zipCodeService: ZipCodeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ address }) => {
      this.updateForm(address);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const address = this.createFromForm();
    if (address.id !== undefined) {
      this.subscribeToSaveResponse(this.addressService.update(address));
    } else {
      this.subscribeToSaveResponse(this.addressService.create(address));
    }
  }

  trackUsStateById(index: number, item: IUsState): number {
    return item.id!;
  }

  trackZipCodeById(index: number, item: IZipCode): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAddress>>): void {
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

  protected updateForm(address: IAddress): void {
    this.editForm.patchValue({
      id: address.id,
      line1: address.line1,
      line2: address.line2,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
    });

    this.usStatesSharedCollection = this.usStateService.addUsStateToCollectionIfMissing(this.usStatesSharedCollection, address.state);
    this.zipCodesSharedCollection = this.zipCodeService.addZipCodeToCollectionIfMissing(this.zipCodesSharedCollection, address.zipCode);
  }

  protected loadRelationshipsOptions(): void {
    this.usStateService
      .query()
      .pipe(map((res: HttpResponse<IUsState[]>) => res.body ?? []))
      .pipe(map((usStates: IUsState[]) => this.usStateService.addUsStateToCollectionIfMissing(usStates, this.editForm.get('state')!.value)))
      .subscribe((usStates: IUsState[]) => (this.usStatesSharedCollection = usStates));

    this.zipCodeService
      .query()
      .pipe(map((res: HttpResponse<IZipCode[]>) => res.body ?? []))
      .pipe(
        map((zipCodes: IZipCode[]) => this.zipCodeService.addZipCodeToCollectionIfMissing(zipCodes, this.editForm.get('zipCode')!.value))
      )
      .subscribe((zipCodes: IZipCode[]) => (this.zipCodesSharedCollection = zipCodes));
  }

  protected createFromForm(): IAddress {
    return {
      ...new Address(),
      id: this.editForm.get(['id'])!.value,
      line1: this.editForm.get(['line1'])!.value,
      line2: this.editForm.get(['line2'])!.value,
      city: this.editForm.get(['city'])!.value,
      state: this.editForm.get(['state'])!.value,
      zipCode: this.editForm.get(['zipCode'])!.value,
    };
  }
}
