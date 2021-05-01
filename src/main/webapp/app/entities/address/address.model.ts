import { IUsState } from 'app/entities/us-state/us-state.model';
import { IZipCode } from 'app/entities/zip-code/zip-code.model';

export interface IAddress {
  id?: number;
  line1?: string;
  line2?: string | null;
  city?: string;
  state?: IUsState;
  zipCode?: IZipCode;
}

export class Address implements IAddress {
  constructor(
    public id?: number,
    public line1?: string,
    public line2?: string | null,
    public city?: string,
    public state?: IUsState,
    public zipCode?: IZipCode
  ) {}
}

export function getAddressIdentifier(address: IAddress): number | undefined {
  return address.id;
}
