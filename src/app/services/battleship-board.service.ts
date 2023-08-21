import { Injectable } from '@angular/core';
import { Board } from '../interfaces/board';
import { Player } from '../interfaces/player';

@Injectable({
  providedIn: 'root',
})
export class BattleshipBoardService {
  playerId: number = 1;
  boards: Board[] = [];
  boardsFromBack: Board[] = [];

  createBoard(size: number = 5) {
    let tiles: any[] = [];
    for (let i = 0; i < size; i++) {
      tiles[i] = [];
      for (let j = 0; j < size; j++) {
        tiles[i][j] = { used: false, value: 0, status: '' };
      }
    }
    for (let i = 0; i < size * 2; i++) {
      tiles = this.randomShips(tiles, size);
    }
    let board = new Board({
      player: new Player({ id: this.playerId++ }),
      tiles: tiles,
    });
    this.boards.push(board);
  }

  randomShips(board: any[], len: number): any[] {
    len = len - 1;
    let ranRow = this.getRandomInt(0, len),
      ranCol = this.getRandomInt(0, len);
    if (board[ranRow][ranCol].value == 1) {
      return this.randomShips(board, len);
    } else {
      board[ranRow][ranCol].value = 1;
      return board;
    }
  }

  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getBoards(): Board[] {
    return this.boards;
  }

  getBoardsFromBackend(): Board[] {
    return this.boardsFromBack;
  }

  createBoards(NUM_PLAYERS: number, BOARD_SIZE: number) {
    this.boardsFromBack.length = 0;
    for (let i = 0; i < NUM_PLAYERS; i++) this.createBoard(BOARD_SIZE);
  }
}
