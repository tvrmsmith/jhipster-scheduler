import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { ZipCodeComponent } from './list/zip-code.component';
import { ZipCodeDetailComponent } from './detail/zip-code-detail.component';
import { ZipCodeUpdateComponent } from './update/zip-code-update.component';
import { ZipCodeDeleteDialogComponent } from './delete/zip-code-delete-dialog.component';
import { ZipCodeRoutingModule } from './route/zip-code-routing.module';

@NgModule({
  imports: [SharedModule, ZipCodeRoutingModule],
  declarations: [ZipCodeComponent, ZipCodeDetailComponent, ZipCodeUpdateComponent, ZipCodeDeleteDialogComponent],
  entryComponents: [ZipCodeDeleteDialogComponent],
})
export class ZipCodeModule {}
