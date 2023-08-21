import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NameInputComponent } from './components/name-input/name-input.component';
import { GameMenuComponent } from './components/game-menu/game-menu.component';
import { BattleshipGameComponent } from './components/battleship-game/battleship-game.component';

const routes: Routes = [
  {
    path: 'name',
    component: NameInputComponent,
  },
  {
    path: 'game-menu',
    component: GameMenuComponent,
  },
  {
    path: 'battleship-game',
    component: BattleshipGameComponent,
  },
  {
    path: '**',
    component: NameInputComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
