import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService, IProfile, IUser, profileColumn, ProfileObject } from '../shared/firestore.service';
import { Observable } from 'rxjs';
import { Tab1Page } from '../tab1/tab1.page';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profileId: string;
  profile_data: IProfile;

  constructor(public route: ActivatedRoute, public firestore: FirestoreService, public tab1Class: Tab1Page) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.profileId = params.get('profileId');
    });

    this.tab1Class.getProfiles().subscribe((profiles) => {
      console.log(profiles);
      this.profile_data = profiles.find((v) => v.profileId === this.profileId);
    });
    // console.log(this.profile_data);
    // console.log(typeof this.profile_data);
  }
}
