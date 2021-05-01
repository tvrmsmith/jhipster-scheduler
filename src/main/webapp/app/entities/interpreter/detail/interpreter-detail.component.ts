import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IInterpreter } from '../interpreter.model';

@Component({
  selector: 'jhi-interpreter-detail',
  templateUrl: './interpreter-detail.component.html',
})
export class InterpreterDetailComponent implements OnInit {
  interpreter: IInterpreter | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ interpreter }) => {
      this.interpreter = interpreter;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
