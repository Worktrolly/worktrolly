import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { Tasks } from 'src/app/Interface/TasksInterface';
import { CloneTaskService } from 'src/app/services/cloneTask/clone-task.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToolsService } from '../../services/tool/tools.service';
import { Location } from '@angular/common';
import { NavbarHandlerService } from 'src/app/services/navbar-handler/navbar-handler.service';
import { ErrorHandlerService } from 'src/app/services/error-handler/error-handler.service';
import { BackendService } from 'src/app/services/backend/backend.service';
import { Activity, ActivityId } from 'src/app/Interface/ActivityInterface';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit {

  componentName: string = "TASK-DETAILS"

  sprintName: string
  Id: string
  logWorkEnabled: boolean = false
  editTaskEnabled: boolean = false
  userLoggedIn: boolean = false
  task: Tasks
  todayDate: string
  time: string
  orgDomain: string

  public taskDocument: AngularFirestoreDocument<Tasks>
  public taskDataObservable: Observable<Tasks>
  activityData: Observable<ActivityId[]>
  tasksCollection: AngularFirestoreCollection<Activity>

  constructor(private route: ActivatedRoute, public db: AngularFirestore, private router: Router, private functions: AngularFireFunctions, public authService: AuthService, private location: Location, public toolsService: ToolsService, private navbarHandler: NavbarHandlerService, public errorHandlerService: ErrorHandlerService, private backendService: BackendService, public cloneTask: CloneTaskService) { }

  ngOnInit(): void {
    this.todayDate = this.toolsService.date();
    this.time = this.toolsService.time();

    this.Id = this.route.snapshot.params['taskId'];

    this.navbarHandler.addToNavbar(this.Id);

    this.authService.afauth.user.subscribe(data => {
      this.authService.userAppSettingObservable.subscribe(data => {
        if (data.AppKey) {
          this.backendService.organizationsData.subscribe(data => {
            this.orgDomain = this.backendService.getOrganizationDomain();
            this.getTaskDetail();
            this.getActivityData();
          });
        }
      });
    });
  }

  getTaskDetail() {
    var documentName = 'Organizations/' + this.orgDomain + '/Tasks/' + this.Id;
    this.taskDocument = this.db.doc<Tasks>(documentName);
    this.taskDataObservable = this.taskDocument.snapshotChanges().pipe(
      map(actions => {
        const data = actions.payload.data() as Tasks;
        this.task = data;
        return { ...data }
      }));
  }

  getActivityData() {
    var documentName = 'Organizations/' + this.orgDomain + '/Activity/' + this.Id + '/Action';
    this.tasksCollection = this.db.collection<Activity>(documentName);
    this.activityData = this.tasksCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Activity;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  CloneTaskPage() {
    this.cloneTask.getCloneTask(this.task);
  }
  logWorkPage() {
    this.logWorkEnabled = true;
  }

  editTask() {
    this.editTaskEnabled = true;
  }

  logWorkCompleted(data: { completed: boolean }) {
    this.logWorkEnabled = false;
  }

  editTaskCompleted(data: { completed: boolean }) {
    this.editTaskEnabled = false;
  }

  async deleteTask() {
    const callable = this.functions.httpsCallable('tasks');
    const appKey = this.backendService.getOrganizationAppKey();
    try {
      const result = await callable({ mode: "delete", AppKey: appKey, Id: this.task.Id, SprintNumber: this.task.SprintNumber, Project: this.task.Project, Status: this.task.Status, Date: this.todayDate, Time: this.time }).toPromise();
      console.log(this.task.Id + " deleted");
      console.log(result);
      this.router.navigate(['/']);
    } catch (error) {
      this.errorHandlerService.getErrorCode(this.componentName, "InternalError");
      console.log("Error", error);
    }
  }

  async reopenTask() {
    const callable = this.functions.httpsCallable('logWork');
    const appKey = this.backendService.getOrganizationAppKey();

    try {
      const result = await callable({ AppKey: appKey, SprintNumber: this.task.SprintNumber, LogTaskId: this.task.Id, LogHours: 0, LogWorkDone: this.task.WorkDone, LogWorkStatus: "Ready to start", LogWorkComment: "Reopening", Date: this.todayDate, Time: this.time }).toPromise();
      console.log(result);
      return;
    }

    catch (error) {
      this.errorHandlerService.getErrorCode("LOGWORK", "InternalError");
      console.log("Error", error);
    }
  }

  backToTasks() {
    this.location.back()
  }

}
