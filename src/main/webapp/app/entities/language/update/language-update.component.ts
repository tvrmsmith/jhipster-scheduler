import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ILanguage, Language } from '../language.model';
import { LanguageService } from '../service/language.service';
import { IInterpreter } from 'app/entities/interpreter/interpreter.model';
import { InterpreterService } from 'app/entities/interpreter/service/interpreter.service';

@Component({
  selector: 'jhi-language-update',
  templateUrl: './language-update.component.html',
})
export class LanguageUpdateComponent implements OnInit {
  isSaving = false;

  interpretersSharedCollection: IInterpreter[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    interpreter: [],
  });

  constructor(
    protected languageService: LanguageService,
    protected interpreterService: InterpreterService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ language }) => {
      this.updateForm(language);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const language = this.createFromForm();
    if (language.id !== undefined) {
      this.subscribeToSaveResponse(this.languageService.update(language));
    } else {
      this.subscribeToSaveResponse(this.languageService.create(language));
    }
  }

  trackInterpreterById(index: number, item: IInterpreter): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILanguage>>): void {
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

  protected updateForm(language: ILanguage): void {
    this.editForm.patchValue({
      id: language.id,
      name: language.name,
      interpreter: language.interpreter,
    });

    this.interpretersSharedCollection = this.interpreterService.addInterpreterToCollectionIfMissing(
      this.interpretersSharedCollection,
      language.interpreter
    );
  }

  protected loadRelationshipsOptions(): void {
    this.interpreterService
      .query()
      .pipe(map((res: HttpResponse<IInterpreter[]>) => res.body ?? []))
      .pipe(
        map((interpreters: IInterpreter[]) =>
          this.interpreterService.addInterpreterToCollectionIfMissing(interpreters, this.editForm.get('interpreter')!.value)
        )
      )
      .subscribe((interpreters: IInterpreter[]) => (this.interpretersSharedCollection = interpreters));
  }

  protected createFromForm(): ILanguage {
    return {
      ...new Language(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      interpreter: this.editForm.get(['interpreter'])!.value,
    };
  }
}
