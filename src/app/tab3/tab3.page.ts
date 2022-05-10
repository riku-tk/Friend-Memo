import { Component, OnInit } from '@angular/core';
import { FirestoreService, IProfile, IUser, profileColumn, ProfileObject } from '../shared/firestore.service';
import { SharedModule } from '../shared/shared.module';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  uid: string;
  email: string;
  user: IUser;
  constructor(public firestore: FirestoreService, public auth: AuthService) {}

  async ngOnInit() {
    this.uid = await this.auth.getUserId();
    this.user = await this.firestore.userInit(this.uid);
    console.log(this.user);
    this.email = await this.auth.getUserEmail();
    console.log(this.email);
  }

  signOut() {
    this.auth.authSignOut();
  }
}
