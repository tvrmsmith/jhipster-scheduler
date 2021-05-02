import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { JobRequestComponent } from './list/job-request.component';
import { JobRequestDetailComponent } from './detail/job-request-detail.component';
import { JobRequestUpdateComponent } from './update/job-request-update.component';
import { JobRequestDeleteDialogComponent } from './delete/job-request-delete-dialog.component';
import { JobRequestRoutingModule } from './route/job-request-routing.module';

@NgModule({
  imports: [SharedModule, JobRequestRoutingModule],
  declarations: [JobRequestComponent, JobRequestDetailComponent, JobRequestUpdateComponent, JobRequestDeleteDialogComponent],
  entryComponents: [JobRequestDeleteDialogComponent],
})
export class JobRequestModule {}
