import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CreatePage } from './create/create.page';

@NgModule({
  declarations: [CreatePage],
  entryComponents: [CreatePage],
  imports: [CommonModule, FormsModule, IonicModule],
})
export class SharedModule {}
