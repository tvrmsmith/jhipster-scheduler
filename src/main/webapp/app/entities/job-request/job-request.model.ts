import * as dayjs from 'dayjs';
import { IInterpreter } from 'app/entities/interpreter/interpreter.model';
import { ILanguage } from 'app/entities/language/language.model';
import { ILocation } from 'app/entities/location/location.model';

export interface IJobRequest {
  id?: number;
  startTime?: dayjs.Dayjs;
  endTime?: dayjs.Dayjs;
  assignedInterpreter?: IInterpreter | null;
  language?: ILanguage;
  location?: ILocation;
}

export class JobRequest implements IJobRequest {
  constructor(
    public id?: number,
    public startTime?: dayjs.Dayjs,
    public endTime?: dayjs.Dayjs,
    public assignedInterpreter?: IInterpreter | null,
    public language?: ILanguage,
    public location?: ILocation
  ) {}
}

export function getJobRequestIdentifier(jobRequest: IJobRequest): number | undefined {
  return jobRequest.id;
}
