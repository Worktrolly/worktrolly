import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { ErrorHandlerService } from 'src/app/services/error-handler/error-handler.service';
import { ValidationService } from 'src/app/services/validation/validation.service';
import { AngularFireStorage } from '@angular/fire/storage';
@Component({
  selector: 'app-organization-details',
  templateUrl: './organization-details.component.html',
  styleUrls: ['./organization-details.component.css']
})
export class OrganizationDetailsComponent implements OnInit {

  @Output() stepAndOrgDomain = new EventEmitter<{ step: number, organizationDomain: string }>();

  componentName: string = "ORGANIZATION-DETAILS"

  constructor(public validationService: ValidationService, public functions: AngularFireFunctions,
    public errorHandlerService: ErrorHandlerService, private fireStorage: AngularFireStorage) { }

  ngOnInit(): void { }

  enableLoader: boolean = false
  logoUploaded: boolean = false

  orgLogo: File = null;
  orgName: string
  orgDomain: string
  orgEmail: string
  orgDescription: string = ""
  orgLogoURL: string


  handleFileInput(files: FileList) {
    this.orgLogo = files.item(0);
    const filePath = `OrganizationLogos/${this.orgLogo.name}`;
    const task = this.fireStorage.upload(filePath, this.orgLogo);
  }

  uploadLogo() {
    this.fireStorage.ref(`OrganizationLogos/${this.orgLogo.name}`).getDownloadURL().subscribe(data => {
      this.orgLogoURL = data
      this.logoUploaded = true
    });
  }

  async submit() {
    let data = [
      { label: "organizationName", value: this.orgName },
      { label: "organizationDomain", value: this.orgDomain },
      { label: "organizationEmail", value: this.orgEmail },
    ];
    var condition = await (this.validationService.checkValidity(this.componentName, data)).then(res => {
      return res;
    });
    if (condition) {
      console.log("Inputs are valid");
      this.createNewOrganization();
    }
    else {
      console.log("Organization not created! Validation error");
    }
  }

  async createNewOrganization() {
    this.enableLoader = true;
    const callable = this.functions.httpsCallable('organization');
    try {
      const result = await callable({ mode: "create", OrganizationName: this.orgName, OrganizationEmail: this.orgEmail, OrganizationDomain: this.orgDomain, OrganizationDescription: this.orgDescription, OrganizationLogoURL: this.orgLogoURL }).toPromise();
      console.log("Successfully created the Organization");
      console.log(result[0]);
      this.enableLoader = false;
      this.stepAndOrgDomain.emit({ step: 2, organizationDomain: this.orgDomain })
    } catch (error) {
      this.enableLoader = false;
      this.errorHandlerService.getErrorCode(this.componentName, "InternalError");
    }
  }
}
