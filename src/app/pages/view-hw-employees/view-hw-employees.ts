import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, LoadingController, ModalController, NavController, NavParams, Platform } from '@ionic/angular';
import { AppCommon } from 'src/app/app.common';
import { HttpserviceService } from 'src/app/services/httpservice.service';
@Component({
  selector: 'page-view-hw-employees',
  templateUrl: 'view-hw-employees.html',
  styleUrls: ['view-hw-employees.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ]
})
export class ViewHwEmployeesPage {
  loginData: any;
  login_client_db: any;
  head_int_code: any;
  hw_list: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,  public appCommon: AppCommon,public http: HttpserviceService,) {

    this.loginData = JSON.parse(localStorage.getItem('loginData'));
    this.login_client_db = this.loginData['login_client_db'];

    this.head_int_code = navParams.get('head_int_code');
    this.getAllHWEmployees();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewHwEmployeesPage');
  }

  dismissView() {
    this.alertCtrl.dismiss();
  }

  getAllHWEmployees() {
    this.appCommon.presentLoader('Please Wait...');

    let url = 'appGetAllHWEmployees&login_client_db=' + this.loginData['login_client_db'];
    url += '&line_int_code=' + this.head_int_code;

    this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)
      this.hw_list = data['data'];
          this.appCommon.dismissLoader();
         

        }, (err:any) => {
          this.appCommon.presentAlert('Server Problem')
          this.appCommon.dismissLoader();
        }
      )
  }
}
