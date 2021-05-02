import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IUsState } from '../us-state.model';
import { UsStateService } from '../service/us-state.service';
import { UsStateDeleteDialogComponent } from '../delete/us-state-delete-dialog.component';

@Component({
  selector: 'jhi-us-state',
  templateUrl: './us-state.component.html',
})
export class UsStateComponent implements OnInit {
  usStates?: IUsState[];
  isLoading = false;

  constructor(protected usStateService: UsStateService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.usStateService.query().subscribe(
      (res: HttpResponse<IUsState[]>) => {
        this.isLoading = false;
        this.usStates = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IUsState): number {
    return item.id!;
  }

  delete(usState: IUsState): void {
    const modalRef = this.modalService.open(UsStateDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.usState = usState;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
