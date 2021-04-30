import { IAddress } from 'app/entities/address/address.model';

export interface IOrganization {
  id?: number;
  name?: string | null;
  address?: IAddress;
}

export class Organization implements IOrganization {
  constructor(public id?: number, public name?: string | null, public address?: IAddress) {}
}

export function getOrganizationIdentifier(organization: IOrganization): number | undefined {
  return organization.id;
}
