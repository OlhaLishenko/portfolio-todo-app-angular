import { Injectable, signal } from '@angular/core';
import { Todo } from '../types/todo';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { catchError, EMPTY, tap } from 'rxjs';

const USER_ID = 2;
const API_URL = 'https://mat.academy/students-api';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  private _todos = new BehaviorSubject<Todo[]>([]);
  private _error = new BehaviorSubject<string | null>(null);
  todos$ = this._todos.asObservable();
  error$ = this._error.asObservable();

  constructor(private http: HttpClient) {
    this.loadTodos();
  }

  loadTodos(): void {
    this.http
      .get<Todo[]>(`${API_URL}/todos?userId=${USER_ID}`)
      .pipe(
        catchError((err) => {
          this._error.next('Unable to load todos');
          return EMPTY;
        }),
      )
      .subscribe((todos) => {
        this._error.next(null);
        this._todos.next(todos);
      });
  }

  createTodo(title: string) {
    const newTodo = {
      title: title,
      userId: USER_ID,
      completed: false,
    };

    return this.http.post<Todo>(`${API_URL}/todos`, newTodo).pipe(
      tap((createdTodo) => this._todos.next([...this._todos.value, createdTodo])),
      catchError((err) => {
        this._error.next('Unable to create todo');
        return EMPTY;
      }),
    );
  }

  updateTodo(todo: Todo) {
    return this.http.patch<Todo>(`${API_URL}/todos/${todo.id}`, todo).pipe(
      tap(() => {
        const updatedTodos = this._todos.value.map((t) =>
          t.id === todo.id ? { ...t, completed: !t.completed } : t,
        );
        this._todos.next(updatedTodos);
      }),
      catchError((err) => {
        this._error.next('Unable to change todo');
        return EMPTY;
      }),
    );
  }

  deleteTodo(todo: Todo) {
    return this.http.delete(`${API_URL}/todos/${todo.id}`).pipe(
      tap(() => {
        this._todos.next([...this._todos.value.filter((t) => t.id !== todo.id)]);
      }),
      catchError((err) => {
        this._error.next('Unable to delete todo');
        return EMPTY;
      }),
    );
  }
}
