import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TodoItem } from '../todo-item/todo-item';
import { Todo as TodoType } from '../../types/todo';
import { TodoForm } from '../todo-form/todo-form';
import { TodosService } from '../../services/todos.service';
import { combineLatest, EMPTY, forkJoin, map, Observable, switchMap, take } from 'rxjs';
import { Message } from '../message/message';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TodoFooter } from '../todo-footer/todo-footer';

@Component({
  selector: 'todo-app',
  templateUrl: './todo-app.html',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TodoItem, TodoForm, AsyncPipe, Message, TodoFooter],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoApp {
  private route = inject(ActivatedRoute);
  todosService = inject(TodosService);
  todos$: Observable<TodoType[]> = this.todosService.todos$;
  error$: Observable<string | null> = this.todosService.error$;

  filter$ = this.route.params.pipe(map((params) => params['filter'] ?? 'all'));
  filteredTodos$ = combineLatest([this.todosService.todos$, this.filter$]).pipe(
    map(([todos, filter]) => {
      switch (filter) {
        case 'active':
          return todos.filter((t) => !t.completed);
        case 'completed':
          return todos.filter((t) => t.completed);
        default:
          return todos;
      }
    }),
  );

  activeTodos$ = this.todosService.todos$.pipe(
    map((todos: TodoType[]) => todos.filter((t: TodoType) => !t.completed)),
  );
  count$ = this.activeTodos$.pipe(map((todos) => todos.length));

  addTodo(newTitle: string) {
    this.todosService.createTodo(newTitle).subscribe();
  }

  deleteTodo(todo: TodoType) {
    this.todosService.deleteTodo(todo).subscribe();
  }

  toggle(todo: TodoType) {
    this.todosService.updateTodo({ ...todo, completed: !todo.completed }).subscribe();
  }

  renameTodo({ todo, title }: { todo: TodoType; title: string }) {
    this.todosService.updateTodo({ ...todo, title }).subscribe();
  }

  deleteCompleted() {
    this.todos$
      .pipe(
        take(1),
        switchMap((todos) => {
          const completed = todos.filter((t) => t.completed);

          if (!completed.length) return EMPTY;

          return forkJoin(completed.map((todo) => this.todosService.deleteTodo(todo)));
        }),
      )
      .subscribe();
  }
}
