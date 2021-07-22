import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { User, UserAppSetting } from "../Interface/UserInterface";
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { BackendService } from './backend/backend.service';
import { ThemeService } from './theme/theme.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})

export class AuthService {

  public userAppSettingObservable: Observable<UserAppSetting>;
  public userAppSettingDocument: AngularFirestoreDocument<UserAppSetting>;

  public organizationAvailable: boolean = true;

  user: User;
  userAppSetting: UserAppSetting;

  constructor(public afauth: AngularFireAuth, private functions: AngularFireFunctions, private db: AngularFirestore, private backendService: BackendService, private themeService: ThemeService) { }

  async createUser(email: string, password: string, username: string) {
    await this.afauth.createUserWithEmailAndPassword(email, password);
    const user = firebase.auth().currentUser;
    user.updateProfile({
      displayName: username
    }).then(() => {
      this.createUserData(user);
    }).catch(function (error) {
      console.log(error);
    });
  }

  async loginUser(email: string, password: string) {
    await this.afauth.signInWithEmailAndPassword(email, password);
  }

  async createUserData(user: User) {
    const callable = this.functions.httpsCallable('users');
    try {
      const result = await callable({ mode: "create", uid: user.uid, photoURL: user.photoURL, displayName: user.displayName, email: user.email, phoneNumber: user.phoneNumber, providerId: user.providerId }).toPromise();
      console.log(result);
    } catch (error) {
      console.error("Error", error);
    }
  }

  async googleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await this.afauth.signInWithPopup(provider);
    this.user = credential.user;
    return this.createUserData(credential.user);
  }

  async logout() {
    await this.afauth.signOut();
  }

  getLoggedInUser() {
    return this.user.uid;
  }

  getUserSettings() {
    const uid = this.getLoggedInUser(); 
    var documentName = 'Users/'+uid;
    this.userAppSettingDocument = this.db.doc<UserAppSetting>(documentName);
    this.userAppSettingObservable = this.userAppSettingDocument.snapshotChanges().pipe(
      map(actions => {
        const data = actions.payload.data() as UserAppSetting;
        this.userAppSetting = data;
        if (this.userAppSetting.AppKey != "") {
          this.backendService.getOrgDetails(this.userAppSetting.AppKey);
          this.themeService.changeTheme(data.AppTheme);
        } else {
          this.organizationAvailable = false;
        }
        return { ...data }
      }));
  }

  getAppKey() {
    return this.userAppSetting.AppKey;
  }

  getTeamId() {
    return this.userAppSetting.TeamId;
  }

}
