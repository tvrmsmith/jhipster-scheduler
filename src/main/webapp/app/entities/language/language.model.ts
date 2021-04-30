export interface ILanguage {
  id?: number;
  name?: string | null;
}

export class Language implements ILanguage {
  constructor(public id?: number, public name?: string | null) {}
}

export function getLanguageIdentifier(language: ILanguage): number | undefined {
  return language.id;
}
