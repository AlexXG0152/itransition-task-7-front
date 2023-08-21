import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Subscription } from 'rxjs';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-game-menu',
  templateUrl: './game-menu.component.html',
  styleUrls: ['./game-menu.component.scss'],
})
export class GameMenuComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private webSocketService: WebSocketService
  ) {}

  subscription: Subscription | undefined;
  gameId: string | undefined;
  userInputGameId: string | UrlTree | undefined | HTMLInputElement;
  name: string | undefined;

  ngOnInit(): void {
    this.webSocketService.getNewMessage().subscribe((message: any) => {
      this.gameId = message.message?.gameId;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  createGame() {
    this.webSocketService.sendMessage({ type: 'createGame' });
    setTimeout(() => {
      this.router.navigateByUrl(`battleship-game?id=${this.gameId}`);
    }, 500);
  }

  joinGame(userInputGameId: string | UrlTree | undefined | HTMLInputElement) {
    this.webSocketService.sendMessage({
      type: 'joinGame',
      gameId: userInputGameId,
    });
    setTimeout(() => {
      this.router.navigateByUrl(`battleship-game?id=${this.userInputGameId}`);
    }, 500);
  }

  saveName() {
    this.webSocketService.sendMessage({ type: 'saveName', name: this.name });
  }
}
