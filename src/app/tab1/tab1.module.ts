import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { RouterModule, Routes } from '@angular/router';

import { ProfileDetailPage } from '../profile-detail/profile-detail.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([
      { path: '', component: Tab1Page },
      {
        path: 'profile-detail',
        component: ProfileDetailPage,
      },
    ]),
  ],
  declarations: [Tab1Page, ProfileDetailPage],
})
export class Tab1PageModule {}
