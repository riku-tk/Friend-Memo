import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CreatePage } from '../shared/create/create.page';
import { SharedModule } from '../shared/shared.module';
import { AuthService } from '../auth/auth.service';
import { FirestoreService, IProfile, ProfileObject } from '../shared/firestore.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
@Injectable({
  providedIn: 'root',
})
export class Tab1Page implements OnInit {
  uid: string;
  email: string;
  profile: Observable<IProfile[]>;

  constructor(public modalController: ModalController, public auth: AuthService, public firestore: FirestoreService) {
    // this.profile = this.firestore.profileInit();
  }

  async ngOnInit() {
    // this.profile = this.firestore.profileInit(this.uid);
    // console.log(this.profile);
  }

  async ionViewWillEnter() {
    this.uid = await this.auth.getUserId();
    console.log(this.uid);
    this.profile = this.firestore.profileInit(this.uid);
  }

  // getProfiles(uid: string) {
  //   let y;
  //   const userProfile = this.profile.subscribe((x) => {
  //     y = x.find((v) => v.id === uid);
  //     return y;
  //   });
  //   return userProfile;
  // }

  async openCreatePage() {
    const modal = await this.modalController.create({
      component: CreatePage,
    });
    await modal.present();
  }
}
