import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CreatePage } from '../shared/create/create.page';
import { SharedModule } from '../shared/shared.module';
import { AuthService } from '../auth/auth.service';
import { FirestoreService, IProfile, IUser, ProfileObject } from '../shared/firestore.service';
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
  user: IUser;
  profile: Observable<IProfile[]>;

  constructor(public modalController: ModalController, public auth: AuthService, public firestore: FirestoreService) {
    this.profile = this.firestore.profileInit();
    console.log(this.profile);
  }

  async ngOnInit() {
    const user = await this.firestore.userInit(await this.auth.getUserId());
    console.log(user);
  }

  async ionViewWillEnter() {
    this.uid = await this.auth.getUserId();
    this.user = await this.firestore.userInit(this.uid);
  }

  getProfiles() {
    return this.profile;
  }

  getProfileData(pid: string): any {
    let y: {};
    return this.profile.subscribe((x) => {
      y = x.find((v) => v.profileId === pid);
      return y;

      // if (typeof y !== undefined) {
      //   return y;
      // }
    });
    // return {};

    // let y = {};
    // let a = {};
    // y = this.profile.subscribe((x) => {
    //   a = x.find((v) => v.profileId === pid);
    // });
    // console.log('test');
    // console.log(y);
    // console.log('test');
    // console.log(a);
  }

  // postMessage() {
  //   if (!this.user) {
  //     alert('プロフィール登録が必要です');
  //     return;
  //   }
  //   this.firestore.messageAdd({
  //     uid: this.uid,
  //     message: this.message,
  //     timestamp: Date.now(),
  //   });
  //   this.message = '';
  //   this.content.scrollToTop(100);
  // }

  // trackByFn(index, item) {
  //   return item.messageId;
  // }

  async openCreatePage() {
    const modal = await this.modalController.create({
      component: CreatePage,
    });
    await modal.present();
  }
}
