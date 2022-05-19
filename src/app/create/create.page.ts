import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { FirestoreService, IProfile } from '../shared/firestore.service';
import { ToastService } from '../shared/toast.service';
import { Observable } from 'rxjs';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  uid: string;
  photo: string;
  profile: Observable<IProfile[]>;
  birthMonthArray: Array<number>;
  birthDayArray: Array<number>;
  profileObject: IProfile = {
    uid: '',
    name: '',
    profession: '',
    gender: '',
    hobby: '',
    favoriteFood: '',
    birthMonthAndDay: '',
    birthMonth: '',
    birthDay: '',
    birthPlace: '',
    dislikes: '',
    pinningFlg: false,
    timeStamp: Date.now(),
  };

  constructor(
    public modalController: ModalController,
    public authService: AuthService,
    public firestore: FirestoreService,
    private toastService: ToastService,
  ) {
    this.birthMonthArray = [...Array(12).keys()].map((i) => ++i);
    this.birthDayArray = [...Array(31).keys()].map((i) => ++i);
  }

  ngOnInit() {}

  modalDismiss() {
    this.modalController.dismiss();
  }

  async ionViewWillEnter() {
    this.uid = await this.authService.getUserId();
  }

  async updateProfile() {
    console.log(this.profileObject);
    if (this.profileObject.birthMonth !== '' && this.profileObject.birthDay !== '') {
      this.profileObject.birthMonthAndDay = this.profileObject.birthMonth + '/' + this.profileObject.birthDay;
    } else if (this.profileObject.birthDay !== '') {
      this.profileObject.birthMonthAndDay = '??月' + this.profileObject.birthDay + '日';
    } else if (this.profileObject.birthMonth !== '') {
      this.profileObject.birthMonthAndDay = this.profileObject.birthMonth + '月' + '??日';
    }
    if (this.profileObject.name === '') {
      this.toastService.presentToast('名前に1文字以上、入力して下さい');
    } else {
      this.profileObject.uid = this.uid;
      this.firestore.profileAdd(this.profileObject);
      this.modalController.dismiss();
    }
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 100,
      resultType: CameraResultType.DataUrl,
    });
    this.profileObject.profilePhotoDataUrl = image && image.dataUrl;
  }
}
