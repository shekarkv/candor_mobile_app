import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, LoadingController, NavController } from '@ionic/angular';
import { AppCommon } from 'src/app/app.common';
import { HttpserviceService } from 'src/app/services/httpservice.service';

@Component({
  selector: 'page-rh-request-status',
  templateUrl: 'rh-request-status.html',
  styleUrls: ['rh-request-status.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ]
})
export class RhRequestStatusPage {
  loginData: any;
  fin_List: any;
  leave_year: any;
  applicant_list: any;
  loading_msg: string;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController,
    public loadingCtrl: LoadingController, public http: HttpserviceService, public appCommon: AppCommon) {

    this.loginData = JSON.parse(localStorage.getItem('loginData'));
    this.loading_msg = 'loading';
    this.getLeaveYear();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RhRequestStatusPage');
  }

  getLeaveYear() {

    this.appCommon.presentLoader('Please Wait...');
    let url = 'appGetLeaveYear&login_client_db=' + this.loginData['login_client_db'];
  
    this.http.postservice(url, '').subscribe((res:any)=>{
        let data = JSON.parse(res.data)
        this.fin_List = data.data['leave_year_list'];
        this.leave_year = data['data']['cur_year'];
        this.appCommon.dismissLoader();
        this.getRHRequestStatus();

        }, (err:any) => {
          this.appCommon.presentAlert('Server Problem')
          this.appCommon.dismissLoader();
        }
      )
  }

  getRHRequestStatus() {
    this.appCommon.presentLoader('Please Wait...');
    let url = 'appGetRHRequestStatus&login_client_db=' + this.loginData['login_client_db'];
    url += '&year_code=' + this.leave_year + '&login_int_code=' + this.loginData['login_int_code'];

    this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)
      this.applicant_list = data.data;

      if (this.applicant_list.length > 0)
        this.loading_msg = 'loaded';
      else
        this.loading_msg = 'No Records Found';

      this.appCommon.dismissLoader();

      }, (err:any) => {
        this.appCommon.presentAlert('Server Problem')
        this.appCommon.dismissLoader();
      }
    )
  }
}
