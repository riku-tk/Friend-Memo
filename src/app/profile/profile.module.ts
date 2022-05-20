import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfilePage } from './profile.page';
import { RouterModule } from '@angular/router';

import { ProfileDetailPage } from '../profile-detail/profile-detail.page';
import { CreatePage } from '../create/create.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: ProfilePage },
      {
        path: 'profile-detail',
        component: ProfileDetailPage,
      },
      {
        path: 'create',
        component: CreatePage,
      },
    ]),
  ],
  declarations: [ProfilePage, ProfileDetailPage, CreatePage],
})
export class ProfilePageModule {}
