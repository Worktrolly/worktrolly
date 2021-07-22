import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Tasks } from 'src/app/Interface/TasksInterface';
import { AngularFireFunctions } from '@angular/fire/functions';
import { ValidationService } from '../../../services/validation/validation.service';
import { ToolsService } from '../../../services/tool/tools.service';
import { ErrorHandlerService } from 'src/app/services/error-handler/error-handler.service';
import { BackendService } from 'src/app/services/backend/backend.service';

@Component({
  selector: 'app-log-work',
  templateUrl: './log-work.component.html',
  styleUrls: ['./log-work.component.css']
})
export class LogWorkComponent implements OnInit {

  @ViewChild('form') form: NgForm;
  @Input('task') task: Tasks
  @Output() logWorkCompleted = new EventEmitter<{ completed: boolean }>();
  
  componentName: string = "LOG-WORK";
  Id: string
  logWorkDone: number
  logWorkStatus: number
  logHours: number
  logWorkComment: string
  todayDate: string
  time: string
  enableLoader: boolean = false;
  showClose: boolean = false;

  constructor(private functions: AngularFireFunctions, public validationService: ValidationService, public toolsService: ToolsService, public errorHandlerService: ErrorHandlerService, public backendService: BackendService) { }

  ngOnInit(): void {
    this.todayDate = this.toolsService.date();
    this.time = this.toolsService.time();
  }

  async submit() {
    let labels = ['status', 'logHours', 'workCompleted', 'comment'];
    let values = [this.logWorkStatus, this.logHours, this.logWorkDone, this.logWorkComment];
    let data = [{ label: "status", value: this.logWorkStatus },
    { label: "logHours", value: this.logHours },
    { label: "workCompleted", value: this.logWorkDone },
    { label: "comment", value: this.logWorkComment }];
    var condition = await (this.validationService.checkValidity(this.componentName, data)).then(res => {
      return res;
    });
    if (condition) {
      console.log("Inputs are valid");
      this.submitLogWorkPage();
    }
    else
      console.log("Log-Work failed due to validation error");
  }

  async submitLogWorkPage() {
    this.enableLoader = true;
    const callable = this.functions.httpsCallable('tasks');
    const appKey = this.backendService.getOrganizationAppKey();

    try {
      const result = await callable({ mode: "log", AppKey: appKey, SprintNumber: this.task.SprintNumber, LogTaskId: this.task.Id, LogHours: this.logHours, LogWorkDone: this.logWorkDone, LogWorkStatus: this.logWorkStatus, LogWorkComment: this.logWorkComment, Date: this.todayDate, Time: this.time }).toPromise();

      console.log("Logged Work Successfully");
      console.log(result);
      this.enableLoader = false;
      this.showClose = true;
      // this.workDone();
      return;
    } catch (error) {
      this.errorHandlerService.getErrorCode("LOGWORK", "InternalError");
      this.enableLoader = false;
      console.log("Error", error);
    }
  }

  workDone() {
    this.logWorkCompleted.emit({ completed: true });
  }
}
