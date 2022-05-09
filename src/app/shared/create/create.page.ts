import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { FirestoreService, IProfile, IUser, profileColumn, ProfileObject } from '../firestore.service';
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
    displayName: null,
    // photoDataUrl: null,
  };
  photo: string;
  profile: Observable<IProfile[]>;
  profileObject: ProfileObject;
  profileTmp: Array<string>;

  constructor(
    public modalController: ModalController,
    public authService: AuthService,
    public firestore: FirestoreService,
  ) {}

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
    this.profileTmp = profileColumn;
    this.profileObject = new ProfileObject();
    console.log(this.profileTmp);
  }

  async updateProfile() {
    console.log(this.profileObject);
    this.firestore.profileAdd({
      uid: this.uid,
      profileId: ulid(),
      timeStamp: Date.now(),
      name: this.profileObject['name'],
      profilePhotoDataUrl: this.profileObject['profilePhotoDataUrl'],
      age: this.profileObject['age'],
      gender: this.profileObject['gender'],
      hobby: this.profileObject['hobby'],
      favoriteFood: this.profileObject['favoriteFood'],
    });
    this.modalController.dismiss();
  }

  trackByFn(index: number, item) {
    return item.messageId;
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 100,
      resultType: CameraResultType.DataUrl,
    });
    this.profileObject['profilePhotoDataUrl'] = image && image.dataUrl;
  }
}
