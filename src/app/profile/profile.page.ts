import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { IonItemSliding, IonList, ModalController, NavController } from '@ionic/angular';
import { CreatePage } from '../create/create.page';
import { ProfileDetailPage } from '../profile-detail/profile-detail.page';
import { ToastService } from '../shared/toast.service';
import { AuthService } from '../auth/auth.service';
import { FirestoreService, IProfile, IMemo } from '../shared/firestore.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
})
export class ProfilePage implements OnInit {
  @ViewChildren(IonItemSliding)
  slidings: QueryList<IonItemSliding>;

  // @ViewChild(IonList)
  // list: IonList;

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

  async pinning(profileData: IProfile, i: number) {
    profileData.pinningFlg = true;
    this.firestore.profileSet(profileData.id, profileData);
    this.toastService.presentToast('ピン留めしました');
    // this.list.closeSlidingItems();
    await this.slidings.get(i).closeOpened();
  }

  async removePin(profileData: IProfile, i: number) {
    profileData.pinningFlg = false;
    this.toastService.presentToast('ピン留めを外しました');
    this.firestore.profileSet(profileData.id, profileData);
    // this.list.closeSlidingItems();
    await this.slidings.get(i).closeOpened();
  }

  trackByFn(index: number, profile: IProfile) {
    return profile.id;
  }
}
