import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then((m) => m.ProfilePageModule),
      },
      {
        path: 'setting',
        loadChildren: () => import('../setting/setting.module').then((m) => m.SettingPageModule),
      },
      {
        path: 'birthday',
        loadChildren: () => import('../birthday/birthday.module').then((m) => m.BirthdayPageModule),
      },
      {
        path: '',
        redirectTo: '/tabs/profile',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/profile',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
