import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AngularFireFunctions } from '@angular/fire/functions';
import { ToolsService } from '../../services/tool/tools.service';

@Component({
  selector: 'app-patch1',
  templateUrl: './patch1.component.html',
  styleUrls: ['./patch1.component.css']
})
export class Patch1Component implements OnInit {
  todayDate: string;
  orgId: string;
  orgDomain: string;
  teamId: string;
  showLoader: boolean = false;


  constructor(private functions: AngularFireFunctions, private location: Location, public toolsService: ToolsService) { }

  ngOnInit(): void {
    this.todayDate = this.toolsService.date();
    console.log("patch running");
  }

  async patch1() {
    this.showLoader = true;
    console.log("Patch1 function running");
    console.log(this.orgDomain, this.orgId, this.teamId);
    const callable = this.functions.httpsCallable('patch');
    await callable({ mode: "patch1", OrgId: this.orgId, OrgDomain: this.orgDomain, TeamId: this.teamId }).toPromise().then(result => {
      this.showLoader = false;
      console.log(result);
    });
  }

  backToDashboard() {
    this.location.back()
  }
}
