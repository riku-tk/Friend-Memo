import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService, IProfile, IUser, ProfileObject } from '../shared/firestore.service';
import { Tab1Page } from '../tab1/tab1.page';
import { Camera, CameraResultType } from '@capacitor/camera';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profileId: string;
  profileData: IProfile;
  id: string;
  birthMonthArray: Array<number>;
  birthDayArray: Array<number>;
  ageArray: Array<number>;

  constructor(
    public route: ActivatedRoute,
    public firestore: FirestoreService,
    public tab1Class: Tab1Page,
    public alertController: AlertController,
    public navController: NavController,
  ) {
    this.birthMonthArray = [...Array(12).keys()].map((i) => ++i);
    this.birthDayArray = [...Array(31).keys()].map((i) => ++i);
    this.ageArray = [...Array(124).keys()];
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.profileId = params.get('profileId');
    });

    this.tab1Class.getProfiles().subscribe((profiles) => {
      console.log(profiles);
      this.profileData = profiles.find((v) => v.profileId === this.profileId);
      this.id = this.profileData.id;
      console.log(this.profileData);
    });
    // console.log(this.profileData);
    // console.log(typeof this.profileData);
  }

  setProfileData() {
    if (this.profileData['birthMonth'] !== '' && this.profileData['birthDay'] !== '') {
      this.profileData['birthMonthAndDay'] = this.profileData['birthMonth'] + '/' + this.profileData['birthDay'];
    } else if (this.profileData['birthDay'] !== '') {
      this.profileData['birthMonthAndDay'] = '??月' + this.profileData['birthDay'] + '日';
    } else if (this.profileData['birthMonth'] !== '') {
      this.profileData['birthMonthAndDay'] = this.profileData['birthMonth'] + '月' + '??日';
    }
    this.firestore.profileSet(this.id, this.profileData);
  }

  deleteProfile() {
    this.firestore.deleteProfile(this.id);
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
            this.navController.back();
          },
        },
      ],
    });

    await alert.present();
  }
}
