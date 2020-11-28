import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { NgForm } from '@angular/forms';
import { Tasks } from 'src/app/Interface/TasksInterface';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.css']
})
export class EditPageComponent implements OnInit {

  @ViewChild('form') form: NgForm;
  @Input('task') task: Tasks
  @Output() editTaskCompleted = new EventEmitter<{ completed: boolean }>();

  editTask: Tasks

  constructor(private functions: AngularFireFunctions) { }

  ngOnInit(): void {
    this.editTask = this.task;
  }

  async editPage() {
    const callable = this.functions.httpsCallable('editPageTask');

    try {
      console.log(this.editTask.Id);
      console.log(this.editTask.Title);
      console.log(this.editTask.Creator);

      const result = await callable({ Id: this.editTask.Id, Title: this.editTask.Title, Creator: this.editTask.Creator, Description: this.editTask.Description, Priority: this.editTask.Priority, Difficulty: this.editTask.Difficulty, Assignee: this.editTask.Assignee, EstimatedTime: this.editTask.ET, Status: this.editTask.Status, Category: this.editTask.Category, SprintNumber: this.editTask.SprintNumber, StoryPointNumber: this.editTask.StoryPointNumber, PreviousId: this.task.SprintNumber, LogWorkTotalTime: this.editTask.LogWorkTotalTime, LogWorkDone: this.editTask.WorkDone, CreationDate: this.editTask.CreationDate }).toPromise();

      console.log("Successfully created the task");
      console.log(result);
      this.editTaskDone();
    } catch (error) {
      console.error("Error", error);
    }
  }

  editTaskDone() {
    this.editTaskCompleted.emit({ completed: true });
  }

}