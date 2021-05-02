import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IInterpreter, Interpreter } from '../interpreter.model';
import { InterpreterService } from '../service/interpreter.service';
import { IAddress } from 'app/entities/address/address.model';
import { AddressService } from 'app/entities/address/service/address.service';

@Component({
  selector: 'jhi-interpreter-update',
  templateUrl: './interpreter-update.component.html',
})
export class InterpreterUpdateComponent implements OnInit {
  isSaving = false;

  addressesCollection: IAddress[] = [];

  editForm = this.fb.group({
    id: [],
    firstName: [],
    lastName: [],
    address: [null, Validators.required],
  });

  constructor(
    protected interpreterService: InterpreterService,
    protected addressService: AddressService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ interpreter }) => {
      this.updateForm(interpreter);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const interpreter = this.createFromForm();
    if (interpreter.id !== undefined) {
      this.subscribeToSaveResponse(this.interpreterService.update(interpreter));
    } else {
      this.subscribeToSaveResponse(this.interpreterService.create(interpreter));
    }
  }

  trackAddressById(index: number, item: IAddress): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IInterpreter>>): void {
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

  protected updateForm(interpreter: IInterpreter): void {
    this.editForm.patchValue({
      id: interpreter.id,
      firstName: interpreter.firstName,
      lastName: interpreter.lastName,
      address: interpreter.address,
    });

    this.addressesCollection = this.addressService.addAddressToCollectionIfMissing(this.addressesCollection, interpreter.address);
  }

  protected loadRelationshipsOptions(): void {
    this.addressService
      .query({ filter: 'interpreter-is-null' })
      .pipe(map((res: HttpResponse<IAddress[]>) => res.body ?? []))
      .pipe(
        map((addresses: IAddress[]) => this.addressService.addAddressToCollectionIfMissing(addresses, this.editForm.get('address')!.value))
      )
      .subscribe((addresses: IAddress[]) => (this.addressesCollection = addresses));
  }

  protected createFromForm(): IInterpreter {
    return {
      ...new Interpreter(),
      id: this.editForm.get(['id'])!.value,
      firstName: this.editForm.get(['firstName'])!.value,
      lastName: this.editForm.get(['lastName'])!.value,
      address: this.editForm.get(['address'])!.value,
    };
  }
}
