export class Player {
  id: number | undefined;
  score: number = 0;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
