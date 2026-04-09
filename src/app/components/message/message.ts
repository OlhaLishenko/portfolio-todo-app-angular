import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-message',
  imports: [],
  template: `
    <article class="message is-danger" [class.message--hidden]="message === null">
      <div class="message-header">
        <p>{{ title }}</p>
        <button class="delete"></button>
      </div>
      <div class="message-body">
        {{ message }}
      </div>
    </article>
  `,
})
export class Message {
  @Input() title = 'Error';
  @Input() message: string | null = null;
}
