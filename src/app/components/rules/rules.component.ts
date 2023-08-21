import { Component } from '@angular/core';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss'],
})
export class RulesComponent {
  language: boolean = true;

  changeLanguage() {
    this.language = !this.language;
    console.log(this.language);

  }
}
