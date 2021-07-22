import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User, UserAppSetting } from 'src/app/Interface/UserInterface';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {
  user: User;
  userAppSetting: UserAppSetting;

  public userObservable: Observable<User>

  appKey: string;
  email:string;
  public showLoader: boolean = false;

  constructor(private functions: AngularFireFunctions, public router: Router, public authService: AuthService) { }

  ngOnInit(): void { }

  start() {
    this.getUser()
    this.showLoader = true;
    // this.createNewOrg();
  }

  async getUser() {
    this.userObservable = this.authService.afauth.user.pipe(map(action => {
      const data = action as User;
      this.user = data
      return { ...data }
    })
    );
    this.email = (await this.authService.afauth.currentUser).email;
    this.createNewOrg();

  }

  async createNewOrg() {
    var condition = true;
    if (condition) {
      console.log("Inputs are valid");
      this.createNewOrganization();
    }
    else {
      console.log("Organization not created! Validation error");
    }
  }

  async createNewOrganization() {
    const callable = this.functions.httpsCallable('organization');
    try {
      const result = await callable({ mode: "create", OrganizationName: "Worktrolly", OrganizationEmail: "worktrolly@gmail.com", OrganizationDomain: "worktrolly.web.app", OrganizationDescription: "dev setup", OrganizationLogoURL: "this.orgLogoURL" }).toPromise();
      console.log("Successfully created the Organization");
      console.log(result[0]);
      console.log("APPKEY: ", result[1]);
      this.appKey = result[1];
      this.createNewTeamWithLabels();
    } catch (error) {
      console.log(error);
    }
  }

  async createNewTeamWithLabels() {
    const callable = this.functions.httpsCallable('teams');
    const priority = ["High", "Medium", "Low"];
    const taskLabels = ["Bug", "Story", "Sub Task"];
    const status = ["Ice Box", "Ready to Start", "Under Progress", "Blocked", "Completed"];
    const difficulty = ["High", "Medium", "Low"];


    try {
      const result = await callable({ mode: "create", OrganizationDomain: "worktrolly.web.app", TeamName: "Development", TeamId: "Dev", TeamDescription: "test", TeamManagerEmail: "worktrolly@gmail.com", TeamMembers: ["member@gmail.com"], TaskLabels: taskLabels, StatusLabels: status, PriorityLabels: priority, DifficultyLabels: difficulty }).toPromise();
      console.log(result);
      this.createNewSprint("Development", "Dev");
    } catch (error) {
      console.error("Error", error);
    }

    try {
      const result = await callable({ mode: "create", OrganizationDomain: "worktrolly.web.app", TeamName: "Marketing", TeamId: "Mar", TeamDescription: "test", TeamManagerEmail: "worktrolly@gmail.com", TeamMembers: ["member@gmail.com"], TaskLabels: taskLabels, StatusLabels: status, PriorityLabels: priority, DifficultyLabels: difficulty }).toPromise();
      console.log(result);
      this.createNewSprint("Marketing", "Mar");
    } catch (error) {
      console.error("Error", error);
    }
  }


  async createNewSprint(project: string, teamId: string) {
    const callable = this.functions.httpsCallable('sprints');

    try {
      const result = await callable({ mode: "create", AppKey: this.appKey, StartDate: "2021-10-09", EndDate: "2021-10-18", Status: "Under Progress", NewSprintId: 1, TeamId: teamId }).toPromise();

      console.log("Successfully created a new sprint");
      console.log(result);
      this.createNewSession(project, teamId);
    } catch (error) {
      console.log(error);
    }


  }

  async createNewSession(project: string, teamId: string) {
    const callable = this.functions.httpsCallable('tasks');

    try {
      const result = await callable({ mode: "create", TeamId: teamId, AppKey: this.appKey, Title: "Title2", Description: "Backlog-2", Priority: "High", Difficulty: "Low", Creator: "Createor", Assignee: "-", EstimatedTime: 5, Status: "Ready to Start", Project: project, SprintNumber: -1, StoryPointNumber: 3, CreationDate: "xx/xx/xxxx", Time: "07:30:21" }).toPromise();

      console.log("Successfully created the task");
      console.log(result);
    } catch (error) {
      console.log(error);
    }

    try {
      const result = await callable({ mode: "create", TeamId: teamId, AppKey: this.appKey, Title: "Title-1", Description: "Backlog description", Priority: "High", Difficulty: "High", Creator: "Createor", Assignee: "-", EstimatedTime: 7, Status: "Ice Box", Project: project, SprintNumber: -1, StoryPointNumber: 7, CreationDate: "xx/xx/xxxx", Time: "07:30:21" }).toPromise();

      console.log("Successfully created the task");
      console.log(result);
    } catch (error) {
      console.log(error);
    }

    try {
      const result = await callable({ mode: "create", TeamId: teamId, AppKey: this.appKey, Title: "1st Task", Description: "Do a task", Priority: "Medium", Difficulty: "Low", Creator: "joe", Assignee: this.email, EstimatedTime: 9, Status: "Ready to start", Project: project, SprintNumber: 1, StoryPointNumber: 9, CreationDate: "xx/xx/xxxx", Time: "07:30:21" }).toPromise();

      console.log("Successfully created the task");
      console.log(result);
    } catch (error) {
      console.log(error);
    }

    try {
      const result = await callable({ mode: "create", TeamId: teamId, AppKey: this.appKey, Title: "2nd Task", Description: "Do a task again", Priority: "High", Difficulty: "Medium", Creator: "joe", Assignee: this.email, EstimatedTime: 24, Status: "Ice Box", Project: project, SprintNumber: 1, StoryPointNumber: 9, CreationDate: "xx/xx/xxxx", Time: "07:30:21" }).toPromise();

      console.log("Successfully created the task");
      console.log(result);
    } catch (error) {
      console.log(error);
    }

    try {
      const result = await callable({ mode: "create", TeamId: teamId, AppKey: this.appKey, Title: "2nd task", Description: "Do this 2nd task", Priority: "High", Difficulty: "Medium", Creator: "Mayo", Assignee: "Ketch", EstimatedTime: 8, Status: "Ready to start", Project: project, SprintNumber: 1, StoryPointNumber: 7, CreationDate: "xx/xx/xxxx", Time: "07:30:21" }).toPromise();

      this.showLoader = false;
      console.log("Successfully created the task");
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

}
