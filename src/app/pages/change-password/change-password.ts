import { Component } from '@angular/core';
import {  NavController, ActionSheetController, LoadingController, AlertController } from '@ionic/angular';
// import { GetService } from '../../app/app.getservice';
import { DatePipe } from '@angular/common';
import { LoginPage } from '../login/login';
import { AppCommon } from '../../app.common';
import { HttpserviceService } from '../../services/httpservice.service'; 
import { IonicModule } from '@ionic/angular'; 
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

// @IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
  styleUrls: ['change-password.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule],
  providers:[DatePipe]
})
export class ChangePasswordPage {
  loginData: any;
  login_client_db: any;
  login_int_code: any;
  login_company: any;
  current_password: any;
  new_password: any;
  confirm_password: any;
  login_code: any;

  constructor(public navCtrl: NavController , public datepipe: DatePipe,
    // public get: GetService, 
    public alertCtrl: AlertController, public loadingCtrl: LoadingController, public http: HttpserviceService,
    public actionSheetCtrl: ActionSheetController, public appCommon: AppCommon) {

    this.loginData = JSON.parse(localStorage.getItem('loginData') || '');
    this.login_client_db = this.loginData['login_client_db'];
    this.login_int_code = this.loginData['login_int_code'];
    this.login_company = this.loginData['login_company'];
    this.login_code = this.loginData['login_code'];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordPage');
  }

  changePassword() {
    this.appCommon.presentLoader('Please Wait...')

    if (this.current_password == undefined || this.current_password == '') {
      this.appCommon.presentAlert('Please enter current password')
      this.appCommon.dismissLoader();
    }
    else if (this.new_password == undefined || this.new_password == '') {
      this.appCommon.presentAlert('Please enter new password')
      this.appCommon.dismissLoader();
    }
    else if (this.confirm_password == undefined || this.confirm_password == '') {
      this.appCommon.presentAlert('Please re-enter password')
      this.appCommon.dismissLoader();
    }
    else if (this.new_password == this.confirm_password) {
      let url = 'appChangePassword&current_password=' + this.current_password + '&new_password=' + this.new_password;
      url += '&login_code=' + this.login_code + '&login_client_db=' + this.login_client_db;

      // this.get.getservice(url).subscribe
      //   (
      //   (data:any) => {
    this.http.postservice(url, '').subscribe((res:any)=>{
          let data = JSON.parse(res.data)
         
          this.appCommon.dismissLoader();
          if (data['error_code'] == 0) {
            this.appCommon.presentAlert(data.data);
            this.appCommon.presentAlert("logged out successfully");
            setTimeout(() => {
              this.appCommon.dismissLoader();
              localStorage.clear();
              // this.navCtrl.setRoot(LoginPage);
              this.navCtrl.navigateRoot('login');
            }, 1000);
          }
          else if (data['error_code'] == -1) {
            this.appCommon.presentAlert(data.data)
          }
          else if (data['error_code'] == -2) {
            this.appCommon.presentAlert(data.data)
          }
        }, (err:any) => {
          this.appCommon.presentAlert('Server Problem')
          this.appCommon.dismissLoader();
        }
      )
    }
    else //when new & confirm psw din't match
    {
      this.appCommon.presentAlert("New & Confirm password mismatch")
      this.appCommon.dismissLoader();
    }
  }
  cancel() {
    this.current_password = '';
    this.new_password = '';
    this.confirm_password = '';
  }
}
