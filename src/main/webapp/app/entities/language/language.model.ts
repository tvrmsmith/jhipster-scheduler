import { IInterpreter } from 'app/entities/interpreter/interpreter.model';

export interface ILanguage {
  id?: number;
  name?: string;
  interpreter?: IInterpreter | null;
}

export class Language implements ILanguage {
  constructor(public id?: number, public name?: string, public interpreter?: IInterpreter | null) {}
}

export function getLanguageIdentifier(language: ILanguage): number | undefined {
  return language.id;
}
