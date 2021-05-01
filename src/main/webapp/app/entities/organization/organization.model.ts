import { ILocation } from 'app/entities/location/location.model';

export interface IOrganization {
  id?: number;
  name?: string | null;
  locations?: ILocation[] | null;
}

export class Organization implements IOrganization {
  constructor(public id?: number, public name?: string | null, public locations?: ILocation[] | null) {}
}

export function getOrganizationIdentifier(organization: IOrganization): number | undefined {
  return organization.id;
}
