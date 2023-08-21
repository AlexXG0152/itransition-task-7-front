import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NameInputComponent } from './components/name-input/name-input.component';
import { GameMenuComponent } from './components/game-menu/game-menu.component';
import { FormsModule } from '@angular/forms';
import { BattleshipGameComponent } from './components/battleship-game/battleship-game.component';
import { ToastrModule } from 'ngx-toastr';
import { RulesComponent } from './components/rules/rules.component';

@NgModule({
  declarations: [
    AppComponent,
    NameInputComponent,
    GameMenuComponent,
    BattleshipGameComponent,
    RulesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
