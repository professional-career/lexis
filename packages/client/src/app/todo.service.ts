import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { ITodo, ICreateTodoDto, IUpdateTodoDto } from '@lexis/contracts';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/todos`;

  getTodos(): Observable<ITodo[]> {
    return this.http.get<ITodo[]>(this.apiUrl);
  }

  createTodo(todo: ICreateTodoDto): Observable<ITodo> {
    return this.http.post<ITodo>(this.apiUrl, todo);
  }

  updateTodo(id: string, todo: IUpdateTodoDto): Observable<ITodo> {
    return this.http.patch<ITodo>(`${this.apiUrl}/${id}`, todo);
  }

  deleteTodo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
