import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IInterpreter } from '../interpreter.model';
import { InterpreterService } from '../service/interpreter.service';

@Component({
  templateUrl: './interpreter-delete-dialog.component.html',
})
export class InterpreterDeleteDialogComponent {
  interpreter?: IInterpreter;

  constructor(protected interpreterService: InterpreterService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.interpreterService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
