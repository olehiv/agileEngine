import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public buttons = [
    {
      title: 'b',
      selected: false,
      action: 'Bold'
    },
    {
      title: 'i',
      selected: false,
      action: 'Italic'
    },
    {
      title: 'u',
      selected: false,
      action: 'Underline'

    }
  ];
}
