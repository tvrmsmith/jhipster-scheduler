import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUsState } from '../us-state.model';

@Component({
  selector: 'jhi-us-state-detail',
  templateUrl: './us-state-detail.component.html',
})
export class UsStateDetailComponent implements OnInit {
  usState: IUsState | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ usState }) => {
      this.usState = usState;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
