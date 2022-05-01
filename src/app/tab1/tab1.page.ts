import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CreatePage } from '../shared/create/create.page';
import { SharedModule } from '../shared/shared.module';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  constructor(public modalController: ModalController) {}

  async ngOnInit() {
    // const modal = await this.modalController.create({
    //   component: CreatePage,
    // });
    // await modal.present();
  }

  async openCreatePage() {
    const modal = await this.modalController.create({
      component: CreatePage,
    });
    await modal.present();
  }
}
