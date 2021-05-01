import { IAddress } from 'app/entities/address/address.model';
import { ILanguage } from 'app/entities/language/language.model';

export interface IInterpreter {
  id?: number;
  firstName?: string | null;
  lastName?: string | null;
  address?: IAddress;
  languages?: ILanguage[];
}

export class Interpreter implements IInterpreter {
  constructor(
    public id?: number,
    public firstName?: string | null,
    public lastName?: string | null,
    public address?: IAddress,
    public languages?: ILanguage[]
  ) {}
}

export function getInterpreterIdentifier(interpreter: IInterpreter): number | undefined {
  return interpreter.id;
}
