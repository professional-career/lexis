import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from './todo.service';
import { ITodo, TODO_STATUS } from '@lexis/contracts';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="todo-container">
      <h1>Lexis Todo-List (Contracts-First Example)</h1>
      
      <div class="add-todo">
        <input [(ngModel)]="newTodoTitle" placeholder="What needs to be done?" (keyup.enter)="addTodo()">
        <button (click)="addTodo()">Add</button>
      </div>

      <div class="todo-list">
        @for (todo of todos(); track todo.id) {
          <div class="todo-item" [class.completed]="todo.status === 'COMPLETED'">
            <input type="checkbox" [checked]="todo.status === 'COMPLETED'" (change)="toggleTodo(todo)">
            <span>{{ todo.title }}</span>
            <button (click)="deleteTodo(todo.id)">Delete</button>
          </div>
        } @empty {
          <p>No tasks yet. Create one!</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .todo-container { max-width: 500px; margin: 2rem auto; font-family: sans-serif; }
    .add-todo { display: flex; gap: 10px; margin-bottom: 20px; }
    .add-todo input { flex: 1; padding: 8px; }
    .todo-item { display: flex; align-items: center; gap: 10px; padding: 10px; border-bottom: 1px solid #eee; }
    .todo-item.completed span { text-decoration: line-through; color: #888; }
    .todo-item span { flex: 1; }
  `]
})
export class TodoComponent implements OnInit {
  private todoService = inject(TodoService);
  
  todos = signal<ITodo[]>([]);
  newTodoTitle = '';

  ngOnInit() {
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.getTodos().subscribe(data => this.todos.set(data));
  }

  addTodo() {
    if (!this.newTodoTitle.trim()) return;
    this.todoService.createTodo({ title: this.newTodoTitle }).subscribe(() => {
      this.newTodoTitle = '';
      this.loadTodos();
    });
  }

  toggleTodo(todo: ITodo) {
    const newStatus = todo.status === TODO_STATUS.PENDING ? TODO_STATUS.COMPLETED : TODO_STATUS.PENDING;
    this.todoService.updateTodo(todo.id, { status: newStatus }).subscribe(() => this.loadTodos());
  }

  deleteTodo(id: string) {
    this.todoService.deleteTodo(id).subscribe(() => this.loadTodos());
  }
}
