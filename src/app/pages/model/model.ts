import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, NavParams } from '@ionic/angular';

// @IonicPage()
@Component({
  selector: 'page-model',
  templateUrl: 'model.html',
  styleUrls: ['model.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ]
})
export class ModelPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModelPage');
  }

}
