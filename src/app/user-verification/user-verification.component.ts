import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/error-handler/error-handler.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-verification',
  templateUrl: './user-verification.component.html',
  styleUrls: ['./user-verification.component.css']
})
export class UserVerificationComponent implements OnInit {
  componentName: string = "Verify User"
  teamName: string
  organizationDomain: string
  userEmail: string
  teamId: string

  constructor(private route: ActivatedRoute, private functions: AngularFireFunctions, public authService: AuthService, public errorHandlerService: ErrorHandlerService, public router: Router) { }

  ngOnInit(): void {
    this.organizationDomain = this.route.snapshot.params['organizationDomain'];
    this.teamName = this.route.snapshot.params['teamName'];
    this.userEmail = this.route.snapshot.params['userEmail'];
    this.teamId = this.route.snapshot.params['teamId'];
    console.log(this.teamName);
  }

  async verifyUser() {
    const callable = this.functions.httpsCallable('users');
    try {
      const result = await callable({ mode: "verify", OrganizationDomain: this.organizationDomain, TeamName: this.teamName, UserEmail: this.userEmail, TeamId: this.teamId }).toPromise();

      console.log("Successfully verified User");
      console.log(result);
      this.router.navigate(['/']);
    } catch (error) {
      this.errorHandlerService.getErrorCode(this.componentName, "InternalError");
    }
  }

}