import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IInterpreter } from '../interpreter.model';
import { InterpreterService } from '../service/interpreter.service';
import { InterpreterDeleteDialogComponent } from '../delete/interpreter-delete-dialog.component';

@Component({
  selector: 'jhi-interpreter',
  templateUrl: './interpreter.component.html',
})
export class InterpreterComponent implements OnInit {
  interpreters?: IInterpreter[];
  isLoading = false;

  constructor(protected interpreterService: InterpreterService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.interpreterService.query().subscribe(
      (res: HttpResponse<IInterpreter[]>) => {
        this.isLoading = false;
        this.interpreters = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IInterpreter): number {
    return item.id!;
  }

  delete(interpreter: IInterpreter): void {
    const modalRef = this.modalService.open(InterpreterDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.interpreter = interpreter;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
