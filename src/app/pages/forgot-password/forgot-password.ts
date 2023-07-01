import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController } from '@ionic/angular';
import { AppCommon } from '../../app.common';
import { HttpserviceService } from '../../services/httpservice.service';  
import { IonicModule } from '@ionic/angular'; 
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

// @IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
  styleUrls: ['forgot-password.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ]
})
export class ForgotPasswordPage {
  email: string;
  username: any;
  email_pattern: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    // public viewCtrl: ViewController,
    public http: HttpserviceService,
    public loadingCtrl: LoadingController, 
    public modalCtrl: ModalController, 
    // public get: GetService, 
    public appCommon: AppCommon) {

    this.username = navParams.get('username');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }

  async close() {
    await this.modalCtrl.dismiss();
  }

  submit() {
    this.email_pattern = '^[a-zA-Z0-9.-_]{1,}@[a-zA-Z0-9.-]{2,}[.]{1}[a-zA-Z]{2,}$';

    if (this.email == '' || this.email == 'undefined' || this.email == undefined) {
      this.appCommon.presentAlert("Please enter E-mail")
      this.email = ''
      return false;
    }
    else if (!this.email.match(this.email_pattern)) {
      this.appCommon.presentAlert("Please enter valid E-mail")
      this.email = ''
      return false;
    }

    this.appCommon.presentLoader('Please Wait...')
    let url = 'appSendPasswordByEmail&username=' + encodeURIComponent(this.username) + '&email=' + encodeURIComponent(this.email);

    this.http.postservice(url,'').subscribe(
      (res:any) => {
        let data = JSON.parse(res.data)

        this.appCommon.presentAlert(data.data);

        console.log(data)
        this.appCommon.dismissLoader(); 
        
        // this.viewCtrl.dismiss();

      }, (err) => {
        this.appCommon.presentAlert('Server Problem')
        this.appCommon.dismissLoader(); 
      }
      )
      return true
  }

}
