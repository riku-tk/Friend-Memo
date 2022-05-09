import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { FirestoreService, IProfile, IUser, profileColumn } from '../firestore.service';
import { Observable } from 'rxjs';

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
    console.log(this.profileTmp);
  }

  async updateProfile() {
    this.firestore.profileAdd({
      uid: this.uid,
      timeStamp: Date.now(),
    });
    this.modalController.dismiss();
  }

  // postMessage() {
  //   this.firestore.profileAdd({
  //     uid: this.uid,
  //     timeStamp: Date.now(),
  //   });
  // }

  trackByFn(index: number, item) {
    return item.messageId;
  }

  // async takePicture() {
  //   const image = await Camera.getPhoto({
  //     quality: 100,
  //     resultType: CameraResultType.DataUrl,
  //   });
  //   this.photo = image && image.dataUrl;
  // }
}
