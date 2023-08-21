import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Board } from 'src/app/interfaces/board';
import { BattleshipBoardService } from 'src/app/services/battleship-board.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

const NUM_PLAYERS = 2;
const BOARD_SIZE = 10;

@Component({
  selector: 'app-battleship-game',
  templateUrl: './battleship-game.component.html',
  styleUrls: ['./battleship-game.component.scss'],
})
export class BattleshipGameComponent implements OnInit, OnDestroy {
  gameUrl: string =
    location.protocol +
    '//' +
    location.hostname +
    (location.port ? ':' + location.port : '');

  subscription: Subscription | undefined;
  canPlay: boolean = true;
  player: number = 0;
  players: number = 0;
  gameId: string | undefined;
  whoWin?: number = 7;

  constructor(
    private toastr: ToastrService,
    private webSocketService: WebSocketService,
    private boardService: BattleshipBoardService
  ) {}

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.initWebSocket();
  }

  initWebSocket() {
    let id: string | null | undefined;
    this.subscription = this.webSocketService
      .getNewMessage()
      .subscribe((message: any) => {
        id = message.message?.gameId || '';
        this.gameId = id!;

        if (message.event === `${id}:member_added`) {
          this.players++;
        } else if (message.event === `${id}:subscription_succeeded`) {
          this.players = message.message.count;
          this.setPlayer(this.players);
          if (this.players === 1 && this.boards.length < 2) {
            this.boardService.createBoards(NUM_PLAYERS, BOARD_SIZE);
            this.webSocketService.sendMessage({
              type: 'created-board',
              player: this.player,
              board1: this.boards[0],
              board2: this.boards[1],
              gameId: this.gameId,
            });
          }
          this.toastr.success('Success', 'Connected!');
        } else if (message.event === `${id}:member_removed`) {
          this.players--;
        } else if (message.event === `${id}:boards`) {
          if (this.boardService.boardsFromBack.length === 0) {
            this.boardService.boardsFromBack.push(message.message.board1);
            this.boardService.boardsFromBack.push(message.message.board2);
          }
          this.players = 2;
        } else if (message.event === 'client-fire') {
          // this.canPlay = message.message.canPlay;
          // this.canPlay = !this.canPlay;
          this.canPlay = true
          this.getBoardsFromBack[message.message.boardId] =
            message.message.board;
          this.getBoardsFromBack[message.message.player].player!.score =
            message.message.score;
            return
        }
      });
  }

  setPlayer(players: number = 0) {
    this.player = players - 1;
    if (players === 1) {
      this.canPlay = true;
    } else if (players === 2) {
      this.canPlay = false;
    }
  }

  fireTorpedo(e: any) {
    let id = e.target.id,
      boardId = id.substring(1, 2),
      row = id.substring(2, 3),
      col = id.substring(3, 4),
      tile = (this.getBoardsFromBack[boardId] as any).tiles[row][col];

    if (!this.checkValidHit(boardId, tile)) {
      return;
    }

    if (tile.value == 1) {
      this.toastr.success('You got this.', 'HURRAAA! YOU SANK A SHIP!');
      (this.getBoardsFromBack[boardId] as any).tiles[row][col].status = 'win';
      this.getBoardsFromBack[this.player].player!.score++;
    } else {
      this.toastr.info('Keep trying fam.', 'OOPS! YOU MISSED THIS TIME');
      (this.getBoardsFromBack[boardId] as any).tiles[row][col].status = 'fail';
    }
    this.canPlay = false;
    (this.getBoardsFromBack[boardId] as any).tiles[row][col].used = true;
    (this.getBoardsFromBack[boardId] as any).tiles[row][col].value = 'X';

    this.webSocketService.sendMessage({
      type: 'client-fire',

      player: this.player,
      score: this.getBoardsFromBack[this.player].player!.score,
      boardId: boardId,
      board: this.getBoardsFromBack[boardId],

      gameId: this.gameId,
    });
  }

  checkValidHit(boardId: number, tile: any): boolean {
    if (boardId == this.player) {
      this.toastr.error(
        "Don't commit suicide.",
        "You can't hit your own board."
      );
      return false;
    }
    if (this.winner) {
      this.toastr.error('Game is over');
      console.log(this.winner.player!.id);
      this.whoWin = this.winner.player!.id

      return false;
    }
    if (!this.canPlay) {
      this.toastr.error('A bit too eager.', "It's not your turn to play.");
      return false;
    }
    if (tile.value == 'X') {
      this.toastr.error("Don't waste your torpedos.", 'You already shot here.');
      return false;
    }
    return true;
  }

  getQueryParam(name: string) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  }

  getUniqueId() {
    return Math.random().toString(36).substr(2, 8);
  }

  get boards(): Board[] {
    return this.boardService.getBoards();
  }
  get getBoardsFromBack(): Board[] {
    return this.boardService.getBoardsFromBackend();
  }

  get winner() {
    return this.getBoardsFromBack.find((board) => board.player!.score >= BOARD_SIZE);
  }

  get validPlayer(): boolean {
    return this.players >= NUM_PLAYERS && this.player < NUM_PLAYERS;
  }
}
