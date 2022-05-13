import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService, IProfile, IMemo } from '../firestore.service';
import { Tab1Page } from '../../tab1/tab1.page';
import { Camera, CameraResultType } from '@capacitor/camera';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.page.html',
  styleUrls: ['./profile-detail.page.scss'],
})
export class ProfileDetailPage implements OnInit {
  @Input() profileData: IProfile;
  @Input() memoList: Observable<IMemo[]>;
  profileId: string;
  birthMonthArray: Array<number>;
  birthDayArray: Array<number>;
  ageArray: Array<number>;
  scene: string;
  memoData: IMemo;
  uid: string;
  profile: Promise<Observable<IProfile[]>>;
  constructor(
    public modalController: ModalController,
    public route: ActivatedRoute,
    public firestore: FirestoreService,
    public tab1Class: Tab1Page,
    public alertController: AlertController,
    public navController: NavController,
    private toastCtrl: ToastController,
    public auth: AuthService,
  ) {
    console.log('test');
    this.birthMonthArray = [...Array(12).keys()].map((i) => ++i);
    this.birthDayArray = [...Array(31).keys()].map((i) => ++i);
    this.ageArray = [...Array(124).keys()];
    this.memoData = { profileId: '', text: '' };
  }

  ngOnInit() {
    this.scene = 'profile';
  }

  modalDismiss() {
    this.modalController.dismiss();
  }

  setProfileData() {
    if (this.profileData['birthMonth'] !== '' && this.profileData['birthDay'] !== '') {
      this.profileData['birthMonthAndDay'] = this.profileData['birthMonth'] + '/' + this.profileData['birthDay'];
    } else if (this.profileData['birthDay'] !== '') {
      this.profileData['birthMonthAndDay'] = '??月' + this.profileData['birthDay'] + '日';
    } else if (this.profileData['birthMonth'] !== '') {
      this.profileData['birthMonthAndDay'] = this.profileData['birthMonth'] + '月' + '??日';
    }
    this.firestore.profileSet(this.profileData.id, this.profileData);
    this.presentToast();
  }

  addMemoData() {
    this.memoData['profileId'] = this.profileData.id;
    this.firestore.memoAdd(this.memoData);
    this.memoData['text'] = '';
  }

  deleteProfile() {
    this.firestore.deleteProfile(this.profileData.id);
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 100,
      resultType: CameraResultType.DataUrl,
    });
    this.profileData['profilePhotoDataUrl'] = image && image.dataUrl;
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '本当に削除しますか？',
      buttons: [
        {
          text: 'いいえ',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {},
        },
        {
          text: 'はい',
          id: 'confirm-button',
          handler: () => {
            this.deleteProfile();
            this.modalDismiss();
          },
        },
      ],
    });
    await alert.present();
  }

  async presentToast() {
    let toast = await this.toastCtrl.create({
      message: '編集しました。',
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }
}
