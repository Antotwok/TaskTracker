import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './task-list.html',
  styleUrls: ['./task-list.css']
})
export class TaskList implements OnInit, AfterViewInit {

  tasks: Task[] = [];

  statusFilter = 'All';
  priorityFilter = 'All';
  private refreshSubscription?: Subscription;

  constructor(
    private taskService: TaskService
  ) {}

  ngOnInit() {
    this.refreshSubscription = this.taskService.refresh$.subscribe(() => {
      this.loadFromServer();
    });
  }

  ngAfterViewInit() {
    queueMicrotask(() => this.loadFromServer());
  }

  ngOnDestroy() {
    this.refreshSubscription?.unsubscribe();
  }

  loadFromServer() {
    this.taskService
      .getTasks()
      .subscribe({
        next: (data) => {
          const normalized = data.map(t => ({
            ...t,
            is_done: this.coerceBoolean((t as any).is_done)
          }));

          this.tasks = normalized.sort((a, b) => {
            if (!a.due_date) return 1;
            if (!b.due_date) return -1;

            return new Date(a.due_date).getTime()
              - new Date(b.due_date).getTime();
          });
        },
        error: (err) => {
          console.error('Failed to load tasks', err);
          this.tasks = [];
        }
      });
  }

  applyFilters() {
    // Client-side filtering is applied via the `filteredTasks` getter.
    // This method intentionally left blank to avoid extra server requests
    // and to keep filter updates immediate.
  }

  trackById(_index: number, task: Task) {
    return task.id;
  }

  toggleDone(task: Task) {

    const updatedTask = {
      ...task,
      is_done: !task.is_done
    };

    this.taskService.updateTask(task.id!, updatedTask).subscribe({
      next: () => this.taskService.refreshTasks(),
      error: (err) => console.error('Failed to update task', err)
    });
  }

  deleteTask(id: number) {

    if (!confirm('Delete task?')) {
      return;
    }

    this.taskService.deleteTask(id).subscribe({
      next: () => this.taskService.refreshTasks(),
      error: (err) => console.error('Failed to delete task', err)
    });
  }

  get filteredTasks() {

    return this.tasks.filter(task => {

      const statusMatch =
        this.statusFilter === 'All' ||
        (this.statusFilter === 'Done' && task.is_done) ||
        (this.statusFilter === 'Pending' && !task.is_done);

      const priorityMatch =
        this.priorityFilter === 'All' ||
        task.priority === this.priorityFilter;

      return statusMatch && priorityMatch;
    });
  }

  get pendingCount() {
    return this.tasks.filter(
      t => !t.is_done
    ).length;
  }

  get doneCount() {
    return this.tasks.filter(
      t => t.is_done
    ).length;
  }

  private coerceBoolean(value: any) {
    return value === true || value === 1 || value === '1' || value === 't' || value === 'true';
  }
}
