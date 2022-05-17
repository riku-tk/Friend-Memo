import { Component, OnInit } from '@angular/core';
import { FirestoreService, IProfile, ProfileObject } from '../shared/firestore.service';
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

  constructor(public firestore: FirestoreService, public auth: AuthService) {}

  async ngOnInit() {
    this.uid = await this.auth.getUserId();
  }

  async signOut() {
    this.email = await this.auth.getUserEmail();
    this.auth.authSignOut();
  }
}
