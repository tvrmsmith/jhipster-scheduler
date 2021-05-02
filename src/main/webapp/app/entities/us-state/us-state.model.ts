export interface IUsState {
  id?: number;
  name?: string;
  abbreviation?: string;
}

export class UsState implements IUsState {
  constructor(public id?: number, public name?: string, public abbreviation?: string) {}
}

export function getUsStateIdentifier(usState: IUsState): number | undefined {
  return usState.id;
}
