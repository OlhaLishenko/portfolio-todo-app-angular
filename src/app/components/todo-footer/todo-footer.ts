import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'todo-footer',
  imports: [RouterLink],
  templateUrl: './todo-footer.html',
})
export class TodoFooter {
  @Input() activeAmount!: number;
  @Input() filter!: string;
  @Output() deleteCompleted = new EventEmitter();
}
