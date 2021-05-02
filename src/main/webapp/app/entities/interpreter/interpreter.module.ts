import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { InterpreterComponent } from './list/interpreter.component';
import { InterpreterDetailComponent } from './detail/interpreter-detail.component';
import { InterpreterUpdateComponent } from './update/interpreter-update.component';
import { InterpreterDeleteDialogComponent } from './delete/interpreter-delete-dialog.component';
import { InterpreterRoutingModule } from './route/interpreter-routing.module';

@NgModule({
  imports: [SharedModule, InterpreterRoutingModule],
  declarations: [InterpreterComponent, InterpreterDetailComponent, InterpreterUpdateComponent, InterpreterDeleteDialogComponent],
  entryComponents: [InterpreterDeleteDialogComponent],
})
export class InterpreterModule {}
