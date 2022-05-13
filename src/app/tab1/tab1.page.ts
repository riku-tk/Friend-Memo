import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { CreatePage } from '../shared/create/create.page';
import { ProfileDetailPage } from '../shared/profile-detail/profile-detail.page';
import { SharedModule } from '../shared/shared.module';
import { AuthService } from '../auth/auth.service';
import { FirestoreService, IProfile, ProfileObject, IMemo } from '../shared/firestore.service';
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
  profileData: IProfile;
  memoList: Observable<IMemo[]>;

  constructor(
    public modalController: ModalController,
    public auth: AuthService,
    public firestore: FirestoreService,
    public navController: NavController,
  ) {
    // this.uid = localStorage.getItem('uid');
    // console.log(this.uid);
    // this.profile = this.firestore.profileInit();
  }

  async ngOnInit() {
    this.uid = await this.auth.getUserId();

    // this.uid = (this.auth.currentUser).uid
    // this.profile = this.firestore.profileInit(this.uid);
    // console.log(this.profile);
  }

  ionViewWillEnter() {
    localStorage.getItem('uid');
    this.profile = this.firestore.profileInit(this.uid);
  }

  async getProfiles() {
    return await this.profile;
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

  async openDetailPage(profileData: IProfile) {
    // this.profile.forEach((profiles) => {
    //   console.log(profiles);
    // const profileData = profiles.find((v) => v.id === profileId);
    // console.log(this.profileData);
    //   const memoList = this.firestore.memoInit(profileId);
    // });
    const modal = await this.modalController.create({
      component: ProfileDetailPage,
      componentProps: {
        profileData: profileData,
        memoList: this.firestore.memoInit(profileData.id),
      },
    });
    await modal.present();
  }

  // async onPresentModal(taskId?: number) {
  //   const modal = await this.modalController.create({
  //     component: TaskModalComponent,
  //     componentProps: {
  //       taskId: taskId,
  //       isEdit: !!taskId,
  //     },
  //   });
  //   return await modal.present();
  // }

  public openItem(itemId: string): void {
    this.navController.navigateForward(['profile', itemId]);
  }
}
