import { IAddress } from 'app/entities/address/address.model';
import { IOrganization } from 'app/entities/organization/organization.model';

export interface ILocation {
  id?: number;
  name?: string;
  address?: IAddress;
  organization?: IOrganization;
}

export class Location implements ILocation {
  constructor(public id?: number, public name?: string, public address?: IAddress, public organization?: IOrganization) {}
}

export function getLocationIdentifier(location: ILocation): number | undefined {
  return location.id;
}
