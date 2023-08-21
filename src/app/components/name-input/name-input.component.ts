import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-name-input',
  templateUrl: './name-input.component.html',
  styleUrls: ['./name-input.component.scss'],
})
export class NameInputComponent {
  name: string | undefined;

  constructor(
    private router: Router,
    private webSocketService: WebSocketService
  ) {}

  saveName() {
    this.webSocketService.sendMessage({ type: 'saveName', name: this.name });
    this.router.navigate(['/game-menu']);
  }
}
