import { Component } from '@angular/core'; 
import { NavController, LoadingController, AlertController, ModalController, Platform } from '@ionic/angular';
// import { GetService } from '../../app/app.getservice';
// import { MenuPage } from '../menu/menu';
import { AppCommon } from '../../app.common';
// import { FCM } from '@ionic-native/fcm';
import { IonicModule } from '@ionic/angular'; 
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
// import { HttpClient, HttpHeaders, HttpClientModule   } from '@angular/common/http';
import { HttpserviceService } from '../../services/httpservice.service'; 
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { NotificationsService } from '../../services/notifications-service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.html',
  styleUrls: ['login.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule
    // ,HttpClientModule
  ]
})

export class LoginPage {

  device_token = '';
  device_type = 'BROWSER';
  username: any;
  password: any;
  // username_pattern: string;

  constructor(public plt: Platform, public navCtrl: NavController,
    // public navParams: NavParams, 
    // public fcm: FCM,
    public loadingCtrl: LoadingController, 
    // public get: GetService, 
    public alertCtrl: AlertController,
    public modalCtrl: ModalController, 
    public platform: Platform, 
    private appCommon: AppCommon,
    public http: HttpserviceService,
    public pushNotifications: NotificationsService
    // public http: HttpClient
    ) {
      this.pushNotifications.initPush();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login() {
    if (this.plt.is('ios'))
      this.device_type = 'IOS';
    else if (this.plt.is('android'))
      this.device_type = 'ANDROID';

    if (this.device_type != 'BROWSER') {
      // this.fcm.getToken().then(token => {
        this.device_token = localStorage.getItem('token');
        this.loginAjax()
      // });
    }
    else {
      this.loginAjax()
    }
  }

  loginAjax() {
    if (this.username == '' || this.username == undefined || this.username == 'undefined') {
      this.appCommon.presentAlert('Enter username')
      return false;
    }
    if (this.password == '' || this.password == undefined || this.password == 'undefined') {
      this.appCommon.presentAlert('Enter password')
      return false;
    }
   
    this.appCommon.presentLoader('Please Wait....')

    let url = 'appValidateUserLogin&username=' + this.username + '&password=' + encodeURIComponent(this.password) + '&device_token=' + this.device_token + '&device_type=' + this.device_type;

    this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)
      console.log('http data ->'+data.data['login_status']);
      // console.log('http data ->'+res.data.data['login_status']);

        if (data.data['login_status'] == 1) {
          console.log('asdf');
          this.appCommon.dismissLoader();
          localStorage.setItem('loginData', JSON.stringify(data.data));
          // this.navCtrl.setRoot(MenuPage);
          // window.location.reload();
          // this.navCtrl.navigateRoot('/home');
          this.navCtrl.navigateRoot('menu/home');
        }
        else {
          this.appCommon.presentAlert(JSON.stringify(data.data['msg']))
          this.appCommon.dismissLoader();
        }
    },(err:any) => { 
          console.log("err -> "+JSON.stringify(err))
          // this.appCommon.presentAlert('Network issue')
          // this.appCommon.presentAlert(JSON.stringify(err))
          if(err.code == "NullPointerException")
            this.loginAjax();

          this.appCommon.dismissLoader();
        }
    );

    return true; 
   }

  async forgotPassword() {

    if (this.username == '' || this.username == undefined || this.username == 'undefined') {
      this.appCommon.presentAlert('Enter username');
      this.username = '';
      return false;
    }

    // let post = this.modalCtrl.create('ForgotPasswordPage', { username: this.username });
    // post.present();
    // post.onDidDismiss((data:any) => {
    //   this.navCtrl.setRoot(LoginPage);
    // });

    const modal = await this.modalCtrl.create({
      component: ForgotPasswordPage,
      componentProps:{
        username: this.username
      }
    });
    

    modal.onDidDismiss().then((data) => {
      this.navCtrl.navigateRoot('login');
    });

    return await modal.present();
  }
}
