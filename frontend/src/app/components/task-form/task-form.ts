import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.html',
  styleUrls: ['./task-form.css'],
})
export class TaskForm {
  task: Task = {
    title: '',
    description: '',
    due_date: '',
    priority: 'Medium',
    is_done: false
  } as Task ;

  showForm = false;

  constructor(
    private taskService: TaskService
  ) {}

  toggleForm() {
    this.showForm = !this.showForm;
  }

  resetForm() {
    this.task = {
      title: '',
      description: '',
      due_date: '',
      priority: 'Medium',
      is_done: false
    };
  }

  addTask() {

    if (!this.task.title.trim()) {
      alert('Title is required');
      return;
    }

    this.taskService.addTask(this.task)
      .subscribe({
        next: () => {

          alert('Task Added Successfully');

          this.resetForm();
          this.showForm = false;
          this.taskService.refreshTasks();

        },
        error: (err) => {
          console.error(err);
          alert('Failed to add task');
        }
      });
  }
}
