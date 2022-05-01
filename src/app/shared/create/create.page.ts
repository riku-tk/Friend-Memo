import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {

  constructor(public modalController: ModalController) { }

  ngOnInit() {
  }

  modalDismiss() {
    this.modalController.dismiss();
  }
}
