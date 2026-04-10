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
import { Todo as TodoType } from '../../types/todo';
import { FormsModule } from '@angular/forms';
import { TodosService } from '../../services/todos.service';
@Component({
  selector: 'todo-item',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './todo-item.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoItem implements OnChanges {
  todosService = inject(TodosService);

  @Input() todo!: TodoType;
  @Output() deleteTodo = new EventEmitter();
  @Output() toggle = new EventEmitter();
  @Output() renameTodo = new EventEmitter<{
    todo: TodoType;
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

    this.renameTodo.emit({ todo: this.todo, title: this.title });
    this.editing = false;
  }
}
