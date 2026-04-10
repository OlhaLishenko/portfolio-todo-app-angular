import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TodosService } from '../../services/todos.service';
import { forkJoin, switchMap, take } from 'rxjs';
@Component({
  selector: 'todo-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './todo-form.html',
})
export class TodoForm {
  todosService = inject(TodosService);
  @Output() addTodo = new EventEmitter<string>();
  @Input() activeAmount: number = 0;

  todoToAddTitle = '';

  handleFormSubmit() {
    if (!this.todoToAddTitle) {
      return;
    }

    this.addTodo.emit(this.todoToAddTitle);
    this.todoToAddTitle = '';
  }

  makeAllCompleted() {
    this.todosService.todos$
      .pipe(
        take(1),
        switchMap((todos) => {
          const todosToChange = todos.map((t) =>
            t.completed === false ? { ...t, completed: true } : t,
          );
          return forkJoin(todosToChange.map((todo) => this.todosService.updateTodo(todo)));
        }),
      )
      .subscribe();
  }
}
