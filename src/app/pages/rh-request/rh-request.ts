import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController, NavController } from '@ionic/angular';
import { AppCommon } from 'src/app/app.common';
import { HttpserviceService } from 'src/app/services/httpservice.service';

@Component({
  selector: 'page-rh-request',
  templateUrl: 'rh-request.html',
  styleUrls: ['rh-request.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ]
})
export class RhRequestPage {
  loginData: any;
  emp_list: any;
  rh_list: any;
  rh: any;
  employee: any;
  reason: any;

  constructor(public navCtrl: NavController,
    public appCommon: AppCommon,public http: HttpserviceService,public loadingCtrl: LoadingController) {

    this.loginData = JSON.parse(localStorage.getItem('loginData'));
    this.employee = this.loginData['login_name'];
    this.getAllEmployeeList();
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RhRequestPage');
  }

  getAllEmployeeList() { 
    this.appCommon.presentLoader('Please Wait...!!');

    let url = 'appGetAllEmployeeList&login_client_db=' + this.loginData['login_client_db'] + '&login_int_code=' + this.loginData['login_int_code'];
   
    this.http.postservice(url, '').subscribe((res:any)=>{
      this.appCommon.dismissLoader();
      let data = JSON.parse(res.data)
          this.emp_list = data['data']['emp_list'];
          this.getAllRestrictedHolidayList(); 

        }, (err:any) => {
          this.appCommon.presentAlert('Server Problem')
          this.appCommon.dismissLoader();
        }
      )
  }

  getAllRestrictedHolidayList() { 
    this.appCommon.presentLoader('Please Wait...!');

    let url = 'appGetRestrictedHolidayList&login_client_db=' + this.loginData['login_client_db'];
   
    this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)
      this.appCommon.dismissLoader();
          this.rh_list = data['data']['rh_list'];
           
        }, (err:any) => {
          this.appCommon.presentAlert('Server Problem')
          this.appCommon.dismissLoader();
        }
      )
  }

  apply() {
    if (this.employee == '' || this.employee == 'undefined' || this.employee == undefined) {
      this.appCommon.presentAlert("Please select employee");
      this.employee = ''
      return false;
    }

    if (this.rh == '' || this.rh == 'undefined' || this.rh == undefined) {
      this.appCommon.presentAlert("Please select restricted holiday");
      this.rh = ''
      return false;
    }

    if (this.reason == '' || this.reason == 'undefined' || this.reason == undefined) {
      this.appCommon.presentAlert("Please enter reason");
      this.reason = ''
      return false;
    }

    this.appCommon.presentLoader('Please Wait...');

    let url = 'appApplyRHRequest&login_client_db=' + this.loginData['login_client_db'] + '&rh=' + this.rh;
    url += '&login_int_code=' + this.loginData['login_int_code'] + '&reason=' + encodeURIComponent(this.reason);

    this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)
      this.appCommon.presentAlert(data.data);
      this.appCommon.dismissLoader();
      this.appCommon.triggerNotification('rh_request','RhRequestPage', this.loginData['login_client_db'], this.loginData['login_int_code']);

      this.employee = '';
      this.rh = '';
      this.reason = '';
          

        }, (err:any) => {
          this.appCommon.presentAlert('Server Problem')
          this.appCommon.dismissLoader();
        }
      )
      return true;
  }

  cancel() {
    this.rh = '';
    this.employee = '';
    this.reason = '';

    this.appCommon.dismissLoader();
  }
}
