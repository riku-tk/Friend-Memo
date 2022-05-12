import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { FirestoreService, IProfile, IUser, ProfileObject } from '../firestore.service';
import { Observable } from 'rxjs';
import { Camera, CameraResultType } from '@capacitor/camera';
import { ulid } from 'ulid';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  uid: string;
  user: IUser = {
    email: null,
  };
  photo: string;
  profile: Observable<IProfile[]>;
  profileObject: ProfileObject;
  birthMonthArray: Array<number>;
  birthDayArray: Array<number>;
  ageArray: Array<number>;

  constructor(
    public modalController: ModalController,
    public authService: AuthService,
    public firestore: FirestoreService,
  ) {
    this.birthMonthArray = [...Array(12).keys()].map((i) => ++i);
    this.birthDayArray = [...Array(31).keys()].map((i) => ++i);
    this.ageArray = [...Array(124).keys()];
    this.profileObject = new ProfileObject();
  }

  ngOnInit() {}

  modalDismiss() {
    this.modalController.dismiss();
  }

  async ionViewWillEnter() {
    this.uid = await this.authService.getUserId();
    const user = await this.firestore.userInit(this.uid);
    if (user) {
      this.user = user;
    }
    this.profile = this.firestore.profileInit();
  }

  async updateProfile() {
    console.log(this.profileObject);
    if (this.profileObject['birthMonth'] !== '' && this.profileObject['birthDay'] !== '') {
      this.profileObject['birthMonthAndDay'] = this.profileObject['birthMonth'] + '/' + this.profileObject['birthDay'];
    } else if (this.profileObject['birthDay'] !== '') {
      this.profileObject['birthMonthAndDay'] = '??月' + this.profileObject['birthDay'] + '日';
    } else if (this.profileObject['birthMonth'] !== '') {
      this.profileObject['birthMonthAndDay'] = this.profileObject['birthMonth'] + '月' + '??日';
    }
    this.firestore.profileAdd({
      uid: this.uid,
      profileId: ulid(),
      timeStamp: Date.now(),
      name: this.profileObject['name'],
      profilePhotoDataUrl: this.profileObject['profilePhotoDataUrl'],
      profession: this.profileObject['profession'],
      // age: this.profileObject['age'],
      gender: this.profileObject['gender'],
      hobby: this.profileObject['hobby'],
      favoriteFood: this.profileObject['favoriteFood'],
      birthMonthAndDay: this.profileObject['birthMonthAndDay'],
      birthMonth: this.profileObject['birthMonth'],
      birthDay: this.profileObject['birthDay'],
      birthPlace: this.profileObject['birthPlace'],
      dislikes: this.profileObject['dislikes'],
    });
    this.modalController.dismiss();
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 100,
      resultType: CameraResultType.DataUrl,
    });
    this.profileObject['profilePhotoDataUrl'] = image && image.dataUrl;
  }
}
