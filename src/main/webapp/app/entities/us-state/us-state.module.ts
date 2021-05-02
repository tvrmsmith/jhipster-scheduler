import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { UsStateComponent } from './list/us-state.component';
import { UsStateDetailComponent } from './detail/us-state-detail.component';
import { UsStateUpdateComponent } from './update/us-state-update.component';
import { UsStateDeleteDialogComponent } from './delete/us-state-delete-dialog.component';
import { UsStateRoutingModule } from './route/us-state-routing.module';

@NgModule({
  imports: [SharedModule, UsStateRoutingModule],
  declarations: [UsStateComponent, UsStateDetailComponent, UsStateUpdateComponent, UsStateDeleteDialogComponent],
  entryComponents: [UsStateDeleteDialogComponent],
})
export class UsStateModule {}
