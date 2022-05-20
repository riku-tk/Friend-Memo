import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BirthdayPage } from './birthday.page';

const routes: Routes = [
  {
    path: '',
    component: BirthdayPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BirthdayPageRoutingModule {}
