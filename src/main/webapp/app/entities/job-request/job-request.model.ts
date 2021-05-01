import * as dayjs from 'dayjs';
import { ILocation } from 'app/entities/location/location.model';

export interface IJobRequest {
  id?: number;
  startTime?: dayjs.Dayjs;
  endTime?: dayjs.Dayjs;
  location?: ILocation;
}

export class JobRequest implements IJobRequest {
  constructor(public id?: number, public startTime?: dayjs.Dayjs, public endTime?: dayjs.Dayjs, public location?: ILocation) {}
}

export function getJobRequestIdentifier(jobRequest: IJobRequest): number | undefined {
  return jobRequest.id;
}
