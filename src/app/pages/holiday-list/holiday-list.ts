import { Component } from '@angular/core';
// import { IonicPage, NavController, NavParams } from '@ionic/angular';
import { LoadingController, AlertController } from '@ionic/angular';
import { HttpserviceService } from '../../services/httpservice.service'; 
import { AppCommon } from '../../app.common';
import { IonicModule } from '@ionic/angular'; 
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

// @IonicPage()
@Component({
  selector: 'page-holiday-list',
  templateUrl: 'holiday-list.html',
  styleUrls: ['holiday-list.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule]
})
export class HolidayListPage {
  loginData: any;
  login_name: any;
  login_client_db: any;
  login_company: any;
  login_int_code: any;
  holiday_list: any;
  loading_msg: any;

  constructor(
    // public navCtrl: NavController, public navParams: NavParams, public get: GetService,
    public http: HttpserviceService,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController, public appCommon: AppCommon) {

    this.loading_msg = 'Loading...';

    this.loginData = JSON.parse(localStorage.getItem('loginData') || '');
    this.login_name = this.loginData['login_name'];
    this.login_client_db = this.loginData['login_client_db'];
    this.login_int_code = this.loginData['login_int_code'];
    this.login_company = this.loginData['login_company'];

    this.getHolidayList();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HolidayListPage');
  }

  getHolidayList() {
    this.loading_msg = 'Loading...';

    this.appCommon.presentLoader('Please Wait...');

    let url = 'appGetHolidayList&login_client_db=' + this.login_client_db + '&login_int_code=' + this.login_int_code;

    this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)
      
        this.holiday_list = data['data'];

        if (this.holiday_list.length > 0)
          this.loading_msg = 'Loaded'
        else
          this.loading_msg = 'No Records Found';

        console.log(data);
        this.appCommon.dismissLoader();
      }, (err:any) => {
        this.appCommon.presentAlert('Server Problem')
        this.appCommon.dismissLoader();
      }
      )
  }
}
