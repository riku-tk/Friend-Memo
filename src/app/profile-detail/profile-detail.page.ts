import { Component, OnInit, Input } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService, IProfile, IMemo } from '../shared/firestore.service';
import { Tab1Page } from '../tab1/tab1.page';
import { Camera, CameraResultType } from '@capacitor/camera';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.page.html',
  styleUrls: ['./profile-detail.page.scss'],
})
export class ProfileDetailPage implements OnInit {
  @Input() profileData: IProfile;
  @Input() memoList: Observable<IMemo[]>;
  profileDataCopy: IProfile;
  profileId: string;
  birthMonthArray: Array<number>;
  birthDayArray: Array<number>;
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
    public actionSheetController: ActionSheetController,
  ) {
    console.log('test');
    this.memoData = { profileId: '', text: '' };
    this.scene = 'memo';
    this.birthMonthArray = [...Array(12).keys()].map((i) => ++i);
    this.birthDayArray = [...Array(31).keys()].map((i) => ++i);
  }

  async ngOnInit() {
    this.profileDataCopy = await Object.assign({}, this.profileData);
  }

  modalDismiss() {
    this.modalController.dismiss();
  }

  setProfileData() {
    if (this.profileDataCopy['birthMonth'] !== '' && this.profileDataCopy['birthDay'] !== '') {
      this.profileDataCopy['birthMonthAndDay'] =
        this.profileDataCopy['birthMonth'] + '/' + this.profileDataCopy['birthDay'];
    } else if (this.profileDataCopy['birthDay'] !== '') {
      this.profileDataCopy['birthMonthAndDay'] = '??月' + this.profileDataCopy['birthDay'] + '日';
    } else if (this.profileDataCopy['birthMonth'] !== '') {
      this.profileDataCopy['birthMonthAndDay'] = this.profileDataCopy['birthMonth'] + '月' + '??日';
    }
    if (this.profileDataCopy['name'] === '') {
      this.presentToast('名前に1文字以上入力して下さい');
    } else {
      this.firestore.profileSet(this.profileDataCopy.id, this.profileDataCopy);
      this.presentToast('編集を保存しました');
    }
  }

  addMemoData() {
    if (this.memoData['text'] === '') {
      this.presentToast('1文字以上入力して下さい');
    } else {
      this.memoData['profileId'] = this.profileData.id;
      this.memoData['timeStamp'] = Date.now();
      this.memoData['pinningFlg'] = false;
      this.firestore.memoAdd(this.memoData);
      this.memoData['text'] = '';
    }
  }

  deleteProfile() {
    this.firestore.deleteProfile(this.profileData.id);
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 100,
      resultType: CameraResultType.DataUrl,
    });
    this.profileDataCopy['profilePhotoDataUrl'] = image && image.dataUrl;
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

  async presentToast(message: string) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }

  async changeMemo(id: string, text: string) {
    const actionSheet = await this.actionSheetController.create({
      header: text,
      buttons: [
        {
          text: '削除',
          icon: 'trash-outline',
          handler: () => {
            this.firestore.deleteMemo(id);
            this.presentToast('「' + text + '」を削除しました');
          },
        },
        {
          text: '編集',
          icon: 'create-outline',
          handler: () => {
            this._renameMemo(id, text);
          },
        },
        {
          text: '閉じる',
          icon: 'close-outline',
          handler: () => {},
        },
      ],
    });
    actionSheet.present();
  }

  async _renameMemo(id: string, text: string) {
    const prompt = await this.alertController.create({
      inputs: [
        {
          name: 'memo',
          placeholder: 'メモ',
          value: text,
        },
      ],
      buttons: [
        {
          text: '閉じる',
        },
        {
          text: '保存',
          handler: (data) => {
            if (data.memo === '') {
              this.presentToast('1文字以上入力して下さい');
            } else {
              this.memoData['profileId'] = this.profileData.id;
              this.memoData['timeStamp'] = Date.now();
              this.memoData['text'] = data.memo;
              this.firestore.memoSet(id, this.memoData);
              this.memoData['text'] = '';
            }
          },
        },
      ],
    });
    prompt.present();
  }

  pinning(profileData: IProfile) {
    profileData['pinningFlg'] = true;
    this.firestore.profileSet(profileData.id, profileData);
    this.presentToast('ピン留めしました');
  }
  removePin(profileData: IProfile) {
    profileData['pinningFlg'] = false;
    this.firestore.profileSet(profileData.id, profileData);
    this.presentToast('ピン留めを外しました');
  }

  pinningMemo(memoData: IMemo) {
    memoData['pinningFlg'] = true;
    this.firestore.memoSet(memoData.id, memoData);
    this.presentToast('ピン留めしました');
  }
  removePinMemo(memoData: IMemo) {
    memoData['pinningFlg'] = false;
    this.firestore.memoSet(memoData.id, memoData);
    this.presentToast('ピン留めを外しました');
  }
}
