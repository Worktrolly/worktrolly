import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Tasks } from 'src/app/Interface/TasksInterface';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-work',
  templateUrl: './log-work.component.html',
  styleUrls: ['./log-work.component.css']
})
export class LogWorkComponent implements OnInit {

  @ViewChild('form') form: NgForm;

  @Input('task') task: Tasks
  @Output() logWorkCompleted = new EventEmitter<{ completed: boolean }>();

Id: string
logWorkDone: number
logWorkStatus: number
logHours: number
logWorkComment: number
sprintName: string

constructor(private functions: AngularFireFunctions, private router: Router) { }

ngOnInit(): void {}

async submitLogWorkPage() {

  const callable = this.functions.httpsCallable('logWork');

  try {
    const result = await callable({ SprintNumber: this.task.SprintNumber, LogTaskId: this.task.Id, LogHours: this.logHours, LogWorkDone: this.logWorkDone, LogWorkStatus: this.logWorkStatus, LogWorkComment: this.logWorkComment }).toPromise();

    console.log("Logged Work Successfully");
    console.log(result);
    this.workDone();
  } catch (error) {
    console.log("Error", error);
  }
}

workDone(){
  this.logWorkCompleted.emit({ completed: true });
}

backToTasks(category: string){
  this.sprintName = "S" + this.task.SprintNumber;
  this.router.navigate(['Tasks', this.task.Category, this.sprintName])
}

backToDashboard(){
  this.router.navigate(['']);
}

}
