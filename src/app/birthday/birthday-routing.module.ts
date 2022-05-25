import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BirthdayPage } from './birthday.page';
import { ProfileDetailPage } from '../profile-detail/profile-detail.page';

const routes: Routes = [
  {
    path: '',
    component: BirthdayPage,
  },
  {
    path: 'profile-detail',
    component: ProfileDetailPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BirthdayPageRoutingModule {}
