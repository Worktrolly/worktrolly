import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/Interface/UserInterface';
import { ValidationService } from '../../services/validation/validation.service';
import { ToolsService } from '../../services/tool/tools.service';
import { Location } from '@angular/common';
import { NavbarHandlerService } from 'src/app/services/navbar-handler/navbar-handler.service';
import { ErrorHandlerService } from 'src/app/services/error-handler/error-handler.service';
import { BackendService } from 'src/app/services/backend/backend.service';
import { ApplicationSettingsService } from 'src/app/services/applicationSettings/application-settings.service';
import { AuthService } from 'src/app/services/auth.service';
import { Tasks } from 'src/app/Interface/TasksInterface';
import { CloneTaskService } from 'src/app/services/cloneTask/clone-task.service';

@Component({
  selector: 'app-create-new-session',
  templateUrl: './create-new-session.component.html',
  styleUrls: ['./create-new-session.component.css']
})
export class CreateNewSessionComponent implements OnInit {

  @ViewChild('form') form: NgForm;

  componentName: string = "CREATE-NEW-TASK";

  title: string
  todayDate: string
  description: string
  assigneeName: string
  creatorName: string
  estimatedTime: number
  project: string
  priority: string
  difficulty: string
  status: string
  sprintNumber: number
  storyPoint: number
  time: string
  enableLoader: boolean = false
  valid: boolean = true
  task: Tasks
  teamIds: string[]
  teamMembers: string[]
  teamName: string

  constructor(private functions: AngularFireFunctions, public validationService: ValidationService, private router: Router, private location: Location, public toolsService: ToolsService, public navbarHandler: NavbarHandlerService, public errorHandlerService: ErrorHandlerService, private backendService: BackendService, private authService: AuthService, public cloneTask: CloneTaskService, public applicationSetting: ApplicationSettingsService) { }
  ngOnInit(): void {
    this.navbarHandler.resetNavbar();
    this.navbarHandler.addToNavbar(this.componentName);
    this.teamIds=this.backendService.getOrganizationTeamIds();
    this.readTeamMembers(this.teamIds[0]);
    this.project=this.teamIds[0];
    this.todayDate = this.toolsService.date();
    this.time = this.toolsService.time();
    this.task= this.cloneTask.getCloneData();
    
    this.title=this.task.Title;
    this.description=this.task.Description;
    this.creatorName=this.task.Creator;
    this.estimatedTime=this.task.EstimatedTime;
    this.priority=this.task.Priority;
    this.difficulty=this.task.Difficulty;
    this.storyPoint=this.task.StoryPointNumber;
  }

  readTeamMembers(teamId :string){
    this.applicationSetting.getTeamDetails(teamId).subscribe(teams => {
          this.teamMembers=teams[0].TeamMembers;
          this.teamName=teams[0].TeamName;
          console.log(this.teamName);
    }); 
  }
  async submit() {
    console.log(this.teamName);
    let data = [{ label: "title", value: this.title },
    { label: "status", value: this.status },
    { label: "priority", value: this.priority },
    { label: "estimatedTime", value: this.estimatedTime },
    { label: "difficulty", value: this.difficulty },
    { label: "description", value: this.description },
    { label: "creator", value: this.creatorName },
    { label: "project", value: this.teamName },
    { label: "assignee", value: this.assigneeName },
    { label: "creationDate", value: this.todayDate },
    { label: "sprintNumber", value: this.sprintNumber },
    { label: "storyPoint", value: this.storyPoint }];
    var condition = await (this.validationService.checkValidity(this.componentName, data)).then(res => {
      return res;
    });
    if (condition) {
      console.log("Inputs are valid");
      this.createNewSession();
    }
    else
      console.log("Task not created! Validation error");
  }

  async createNewSession() {
    this.enableLoader = true;
    const appKey = this.backendService.getOrganizationAppKey();
    const teamId = this.authService.getTeamId();
    const callable = this.functions.httpsCallable('tasks');

    try {
      const result = await callable({mode: "create", TeamId: teamId, AppKey: appKey, Title: this.title, Description: this.description, Priority: this.priority, Difficulty: this.difficulty, Creator: this.creatorName, Assignee: this.assigneeName, EstimatedTime: this.estimatedTime, Status: this.status, Project: this.teamName, SprintNumber: this.sprintNumber, StoryPointNumber: this.storyPoint, CreationDate: this.todayDate, Time: this.time }).toPromise();

      console.log("Successfully created the task");
      console.log(result);
      this.cloneTask.resetTask();
      this.router.navigate(['MyDashboard']);
    } catch (error) {
      this.errorHandlerService.getErrorCode(this.componentName, "InternalError");
      this.enableLoader = false;
    }
  }

  backToDashboard() {
    this.location.back()
  }

}
