import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Todo as TodoItem } from '../../types/todo';
import { FormsModule } from '@angular/forms';
import { LowerCasePipe } from '@angular/common';
import { TodosService } from '../../services/todos.service';
@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [FormsModule, LowerCasePipe],
  templateUrl: './todo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Todo implements OnChanges {
  todosService = inject(TodosService);

  @Input() todo!: TodoItem;
  @Output() deleteTodo = new EventEmitter();
  @Output() toggle = new EventEmitter();
  @Output() renameTodo = new EventEmitter<{
    todo: TodoItem;
    title: string;
  }>();

  @ViewChild('titleField')
  set titleField(field: ElementRef) {
    if (field) {
      field.nativeElement.focus();
    }
  }

  ngOnChanges({ todo }: SimpleChanges): void {
    if (todo.currentValue.title !== todo.previousValue?.title) {
      this.title = todo.currentValue.title;
    }
  }
  editing = false;
  title = '';

  edit() {
    this.editing = true;
    this.title = this.todo.title;
  }

  save() {
    if (!this.editing) {
      return;
    }

    this.editing = false;
    this.renameTodo.emit({ todo: this.todo, title: this.title });
  }
}
