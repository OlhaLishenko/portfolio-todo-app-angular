import { Component, EventEmitter, inject, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TodosService } from '../../services/todos.service';
@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './todo-form.html',
})
export class TodoForm {
  todosService = inject(TodosService);
  @Output() addTodo = new EventEmitter<string>();

  todoForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
  });

  get title() {
    return this.todoForm.get('title') as FormControl;
  }

  handleFormSubmit() {
    if (!this.title.valid) {
      return;
    }

    this.addTodo.emit(this.title.value);
    this.todoForm.reset();
  }
}
