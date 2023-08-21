import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  socket = io(environment.SOCKET, {
    path: '/my-custom-path/',
  });

  public message$: BehaviorSubject<string> = new BehaviorSubject('');

  public sendMessage(message: any): void {
    this.socket.emit('message', message);
  }

  public getNewMessage(): Observable<string> {
    this.socket.on('message', (message) => {
      this.message$.next(JSON.parse(message));
    });

    return this.message$.asObservable();
  }
}
