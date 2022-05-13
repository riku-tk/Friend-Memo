import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { CreatePage } from '../shared/create/create.page';
import { ProfileDetailPage } from '../shared/profile-detail/profile-detail.page';
import { AuthService } from '../auth/auth.service';
import { FirestoreService, IProfile, IMemo } from '../shared/firestore.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
@Injectable({
  providedIn: 'root',
})
export class Tab1Page implements OnInit {
  email: string;
  profile: Observable<IProfile[]>;
  profileData: IProfile;
  memoList: Observable<IMemo[]>;

  constructor(
    public modalController: ModalController,
    public auth: AuthService,
    public firestore: FirestoreService,
    public navController: NavController,
  ) {}

  async ngOnInit() {}

  async ionViewWillEnter() {
    this.profile = this.firestore.profileInit(await this.auth.getUserId());
  }

  async getProfiles() {
    return await this.profile;
  }

  async openCreatePage() {
    const modal = await this.modalController.create({
      component: CreatePage,
    });
    await modal.present();
  }

  async openDetailPage(profileData: IProfile) {
    const modal = await this.modalController.create({
      component: ProfileDetailPage,
      componentProps: {
        profileData: profileData,
        memoList: this.firestore.memoInit(profileData.id),
      },
    });
    await modal.present();
  }

  public openItem(itemId: string): void {
    this.navController.navigateForward(['profile', itemId]);
  }
}
