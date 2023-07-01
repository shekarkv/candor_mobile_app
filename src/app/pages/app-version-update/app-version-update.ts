import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular'; 
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
// import { Market } from '@ionic-native/market';

// @IonicPage()
@Component({
  selector: 'page-app-version-update',
  templateUrl: 'app-version-update.html',
  styleUrls: ['app-version-update.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ]
})
export class AppVersionUpdatePage {

  constructor(public navCtrl: NavController 
    // ,private market: Market
    ) {
  } 

  ionViewDidLoad() {
    console.log('ionViewDidLoad AppVersionUpdatePage');
  }

  OpenGooglePlayStore() {
    // this.market.open('com.tarka.ecandor');
    window.open("https://play.google.com/store/apps/details?id=com.tarka.ecandor","_system")
  }

}
