import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { CreatePage } from '../create/create.page';
import { ProfileDetailPage } from '../profile-detail/profile-detail.page';
import { ToastService } from '../shared/toast.service';
import { AuthService } from '../auth/auth.service';
import { FirestoreService, IProfile, IMemo } from '../shared/firestore.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
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
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.profile = this.firestore.profileInit(this.auth.getUserId());
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
        profileData,
        memoList: this.firestore.memoInit(profileData.id),
      },
    });
    await modal.present();
  }

  public openItem(itemId: string): void {
    this.navController.navigateForward(['profile', itemId]);
  }

  removePin(profileData: IProfile) {
    profileData.pinningFlg = false;
    this.toastService.presentToast('ピン留めを外しました');
    this.firestore.profileSet(profileData.id, profileData);
  }
}
