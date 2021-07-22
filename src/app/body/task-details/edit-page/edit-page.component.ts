import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { NgForm } from '@angular/forms';
import { Tasks } from 'src/app/Interface/TasksInterface';
import { Router } from '@angular/router';
import { ValidationService } from '../../../services/validation/validation.service';
import { ErrorHandlerService } from 'src/app/services/error-handler/error-handler.service'
import { ToolsService } from 'src/app/services/tool/tools.service';
import { BackendService } from 'src/app/services/backend/backend.service';


@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.css']
})
export class EditPageComponent implements OnInit {

  componentName: string = "EDIT-TASK";

  @ViewChild('form') form: NgForm;
  @Input('task') task: Tasks
  @Output() editTaskCompleted = new EventEmitter<{ completed: boolean }>();

  editTask: Tasks
  previousSprintId: number
  enableLoader: boolean = false;
  todayDate: string
  time: string
  changedData: string = ""
  prevVal = []
  newVal = []
  showClose: boolean = false;

  constructor(private functions: AngularFireFunctions, private router: Router, public validationService: ValidationService, public toolsService: ToolsService, public errorHandlerService: ErrorHandlerService, private backendService: BackendService) { }

  ngOnInit(): void {

    this.todayDate = this.toolsService.date();
    this.time = this.toolsService.time();

    this.editTask = this.task;
    this.previousSprintId = this.task.SprintNumber;
    this.prevVal = [this.task.Description, this.task.Assignee, this.task.EstimatedTime, this.task.Priority, this.task.Difficulty, this.task.StoryPointNumber];
  }

  async submit() {
    let data = [{ label: "priority", value: this.editTask.Priority },
    { label: "estimatedTime", value: this.editTask.EstimatedTime },
    { label: "difficulty", value: this.editTask.Difficulty },
    { label: "description", value: this.editTask.Description },
    { label: "assignee", value: this.editTask.Assignee },
    { label: "sprintNumber", value: this.editTask.SprintNumber },
    { label: "storyPoint", value: this.editTask.StoryPointNumber }];
    var condition = await (this.validationService.checkValidity(this.componentName, data)).then(res => {
      return res;
    });
    if (condition) {
      this.newVal = [this.editTask.Description, this.editTask.Assignee, this.editTask.EstimatedTime, this.editTask.Priority, this.editTask.Difficulty, this.editTask.StoryPointNumber];
      this.generateChanges();
      console.log("Inputs are valid");
      this.editPage();
    }
    else
      console.log("Page not edited due to validation error");
  }

  async generateChanges() {
    console.log(this.editTask, this.task);
    if (this.prevVal[0] != this.newVal[0])
      this.changedData = this.changedData + " description,";
    if (this.prevVal[1] != this.newVal[1])
      this.changedData = this.changedData + " assignee,";
    if (this.prevVal[2] != this.newVal[2])
      this.changedData = this.changedData + " estimated-time,";
    if (this.prevVal[3] != this.newVal[3])
      this.changedData = this.changedData + " priority,";
    if (this.prevVal[4] != this.newVal[4])
      this.changedData = this.changedData + " difficulty,";
    if (this.prevVal[5] != this.newVal[5])
      this.changedData = this.changedData + " story-point,";
    if (this.changedData != "")
      this.changedData = "Edited-" + this.changedData;
    this.changedData = this.changedData.substring(0, this.changedData.length - 1) + "."
    console.log(this.changedData);
  }

  async editPage() {
    this.enableLoader = true
    const callable = this.functions.httpsCallable('tasks');

    try {
      const appKey = this.backendService.getOrganizationAppKey();
      console.log(this.editTask.Id);
      console.log(this.editTask.Title);
      console.log(this.editTask.Creator);

      console.log(this.editTask.SprintNumber);
      if (!(this.task.Status === "Completed")) {
        const result = await callable({ mode: "edit", AppKey: appKey, Id: this.editTask.Id, Description: this.editTask.Description, Priority: this.editTask.Priority, Difficulty: this.editTask.Difficulty, Assignee: this.editTask.Assignee, EstimatedTime: this.editTask.EstimatedTime, Project: this.task.Project, SprintNumber: this.editTask.SprintNumber, StoryPointNumber: this.editTask.StoryPointNumber, PreviousId: this.previousSprintId, CreationDate: this.editTask.CreationDate, Date: this.todayDate, Time: this.time, ChangedData: this.changedData }).toPromise();
        console.log("Successfully Updated the task");
        console.log(result);
        this.enableLoader = false;
        this.showClose = true;
        // this.editTaskDone();
      }
      else {
        console.log("Task is Completed , Cannot Update");
      }
    } catch (error) {
      this.errorHandlerService.getErrorCode(this.componentName, "InternalError");
      this.enableLoader = false;
    }
  }

  editTaskDone() {
    this.editTaskCompleted.emit({ completed: true });
  }

  backToTaskDetails() {
    window.location.reload();
  }
}