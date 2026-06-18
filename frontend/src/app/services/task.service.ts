import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl =
    'http://localhost:3000/api/tasks';

  constructor(
    private http: HttpClient
  ) {}

  getTasks(filters?: { status?: string; priority?: string }): Observable<Task[]> {
    const params: Record<string, string> = {};

    if (filters?.['status'] && filters['status'] !== 'All') {
      params['status'] = filters['status'];
    }

    if (filters?.['priority'] && filters['priority'] !== 'All') {
      params['priority'] = filters['priority'];
    }

    const options = Object.keys(params).length
      ? { params }
      : {};

    return this.http.get<Task[]>(this.apiUrl, options);
  }

  addTask(task: Task) {
    return this.http.post(this.apiUrl, task);
  }

  updateTask(id: number, task: Task) {
    return this.http.put(
      `${this.apiUrl}/${id}`,
      task
    );
  }

  deleteTask(id: number) {
    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }
}