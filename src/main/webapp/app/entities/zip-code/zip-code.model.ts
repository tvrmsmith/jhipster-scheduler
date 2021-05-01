export interface IZipCode {
  id?: number;
  value?: string;
}

export class ZipCode implements IZipCode {
  constructor(public id?: number, public value?: string) {}
}

export function getZipCodeIdentifier(zipCode: IZipCode): number | undefined {
  return zipCode.id;
}
