import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IZipCode } from '../zip-code.model';

@Component({
  selector: 'jhi-zip-code-detail',
  templateUrl: './zip-code-detail.component.html',
})
export class ZipCodeDetailComponent implements OnInit {
  zipCode: IZipCode | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ zipCode }) => {
      this.zipCode = zipCode;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
