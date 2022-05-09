import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CreatePage } from '../shared/create/create.page';
import { SharedModule } from '../shared/shared.module';
import { AuthService } from '../auth/auth.service';
import { FirestoreService, IProfile, IUser, profileColumn, ProfileObject } from '../shared/firestore.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  uid: string;
  user: IUser;
  profile: Observable<IProfile[]>;

  constructor(public modalController: ModalController, public auth: AuthService, public firestore: FirestoreService) {}

  async ngOnInit() {
    const user = await this.firestore.userInit(await this.auth.getUserId());
    // if (!user) {
    //   const modal = await this.modalController.create({
    //     component: ProfilePage,
    //   });
    //   await modal.present();
    //   modal.onWillDismiss().then(() => this.ionViewWillEnter());
    // }
    this.profile = this.firestore.profileInit();
  }
  async ionViewWillEnter() {
    this.uid = await this.auth.getUserId();
    this.user = await this.firestore.userInit(this.uid);
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
