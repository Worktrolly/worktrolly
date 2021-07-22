import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireFunctions } from '@angular/fire/functions';
import { ErrorHandlerService } from 'src/app/services/error-handler/error-handler.service';
import { BackendService } from 'src/app/services/backend/backend.service';
import { ApplicationSettingsService } from 'src/app/services/applicationSettings/application-settings.service';
import { Sprint } from 'src/app/Interface/TeamInterface';

@Component({
  selector: 'app-sprint-details',
  templateUrl: './sprint-details.component.html',
  styleUrls: ['./sprint-details.component.css']
})
export class SprintDetailsComponent implements OnInit {

  @Input('currentSprintName') currentSprintName: string;
  @Input('currentSprintNumber') currentSprintNumber: number
  @Input('sprintData') sprintData: Sprint;
  @Output() currentSprint = new EventEmitter<number>();

  componentName: string = "SPRINT-DETAILS"
  filterSprintNumber: number;

  constructor(public applicationSettingsService: ApplicationSettingsService, private functions: AngularFireFunctions, public errorHandlerService: ErrorHandlerService, public backendService: BackendService, private router: Router) { }

  ngOnInit(): void {
  }

  async changeSprintStatus(sprintStatus: string) {
    const callable = this.functions.httpsCallable('sprints');
    const appKey = this.backendService.getOrganizationAppKey();
    try {
      const result = await callable({ mode: "update", AppKey: appKey, CurrentSprintName: this.currentSprintName, SprintStatus: sprintStatus, TeamId: this.sprintData.TeamId }).toPromise();
      console.log(sprintStatus);
      console.log("Successfully updated Status");
    } catch (error) {
      this.errorHandlerService.getErrorCode(this.componentName, "InternalError");
    }
  }

  changeSprintNumber() {
    this.currentSprint.emit(this.filterSprintNumber);
  }

  showTasks() {
    this.router.navigate(['/Tasks', this.sprintData.TeamId, this.currentSprintName])
  }

  ActiveSprint() {
    this.currentSprint.emit(this.currentSprintNumber);
  }

  showBacklog() {
    this.currentSprint.emit(-1);
  }

  showDeleted() {
    this.currentSprint.emit(-2);
  }
}
