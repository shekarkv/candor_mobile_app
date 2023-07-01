import { Component } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

// @IonicPage()
@Component({
  selector: 'page-my-account',
  templateUrl: 'my-account.html',
  styleUrls: ['my-account.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ]
})
export class MyAccountPage {
  loginData: any;
  login_user_type: any;

  constructor(public navCtrl: NavController ) {

    this.loginData = JSON.parse(localStorage.getItem('loginData') || '');
    this.login_user_type = this.loginData['login_user_type'];
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad MyAccountPage');
  }
  openMyProfile() {
    // this.navCtrl.push('PersonalDetailsPage');
    this.navCtrl.navigateRoot('menu/PersonalDetails');
  }
  openHelpDesk() {
    // this.navCtrl.push('HelpPage');
    this.navCtrl.navigateRoot('HelpPage');
  }
  openChangePasswordPage() {
    // this.navCtrl.push('ChangePasswordPage');
    this.navCtrl.navigateRoot('menu/ChangePasswordPage');
  }
  openHolidayListPage() {
    // this.navCtrl.push('HolidayListPage');
    this.navCtrl.navigateRoot('menu/HolidayListPage');
  }
}
