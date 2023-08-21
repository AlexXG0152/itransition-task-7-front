import { Player } from './player';
export class Board {
  player: Player | undefined;
  tiles: any[] | undefined;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
