import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../shared/firestore.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-Setting',
  templateUrl: 'Setting.page.html',
  styleUrls: ['Setting.page.scss'],
})
export class SettingPage implements OnInit {
  uid: string;
  email: string;

  constructor(public firestore: FirestoreService, public auth: AuthService) {}

  async ngOnInit() {
    this.uid = await this.auth.getUserId();
    this.email = await this.auth.getUserEmail();
  }

  async signOut() {
    this.auth.authSignOut();
  }
}
