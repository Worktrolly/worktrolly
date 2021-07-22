import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AngularFireFunctions } from '@angular/fire/functions';
import { ToolsService } from '../../services/tool/tools.service';
@Component({
  selector: 'app-patch2',
  templateUrl: './patch2.component.html',
  styleUrls: ['./patch2.component.css']
})
export class Patch2Component implements OnInit {
  todayDate: string;
  orgId: string;
  orgDomain: string;
  taskId: string;
  newfield: string;
  newFieldValue: string;
  showLoader: boolean = false;

  constructor(private functions: AngularFireFunctions, private location: Location, public toolsService: ToolsService) { }

  ngOnInit(): void {
    this.todayDate = this.toolsService.date();
    console.log("patch running");
  }

  async patch2() {
    this.showLoader = true;
    console.log("Patch2 function running");
    console.log(this.orgDomain, this.newfield, this.newFieldValue);
    const callable = this.functions.httpsCallable('patch');
    await callable({ mode: "patch2", OrgDomain: this.orgDomain, newField: this.newfield, NewFieldValue: this.newFieldValue }).toPromise().then(result => {
      this.showLoader = false;
      console.log(result);
      alert(result);
    });
  }


  backToDashboard() {
    this.location.back()
  }
}
