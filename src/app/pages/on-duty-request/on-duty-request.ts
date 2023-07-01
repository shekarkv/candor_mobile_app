import { Component } from '@angular/core';
import { NavController, LoadingController, IonicModule } from '@ionic/angular';
import { AppCommon } from 'src/app/app.common';
import { HttpserviceService } from 'src/app/services/httpservice.service';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';

// @IonicPage()
@Component({
  selector: 'page-on-duty-request',
  templateUrl: 'on-duty-request.html',
  styleUrls: ['on-duty-request.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ]
})
export class OnDutyRequestPage {
  loginData: any;
  emp_list: any;
  travel_type: string;
  visit_place: string;
  travel_start_date: string;
  travel_end_date: string;
  reason: string;
  employee: any;

  constructor(public navCtrl: NavController, public http: HttpserviceService, public appCommon: AppCommon,
    public loadingCtrl: LoadingController) {

    this.loginData = JSON.parse(localStorage.getItem('loginData'));
    this.employee = this.loginData['login_name'];
    this.getAllEmployeeList();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OnDutyRequestPage');
  }

  getAllEmployeeList() {

    this.appCommon.presentLoader('Please Wait...');

    let url = 'appGetAllEmployeeList&login_client_db=' + this.loginData['login_client_db'] + '&login_int_code=' + this.loginData['login_int_code'];
    this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)

        this.emp_list = data['data']['emp_list'];

        this.appCommon.dismissLoader();

      }, (err) => {
        this.appCommon.presentAlert('Server Problem');
      }
    )
  }

  cancel(){
    
  }

  apply() {

    if (this.travel_type == '' || this.travel_type == 'undefined' || this.travel_type == undefined) {
      this.appCommon.presentAlert("Please enter travel type");
      this.travel_type = ''
      return false;
    }

    if (this.visit_place == '' || this.visit_place == 'undefined' || this.visit_place == undefined) {
      this.appCommon.presentAlert("Please enter visit place");
      this.visit_place = ''
      return false;
    }

    if (this.travel_start_date == '' || this.travel_start_date == 'undefined' || this.travel_start_date == undefined) {
      this.appCommon.presentAlert("Please enter travel start_date");
      this.travel_start_date = ''
      return false;
    }

    if (this.travel_end_date == '' || this.travel_end_date == 'undefined' || this.travel_end_date == undefined) {
      this.appCommon.presentAlert("Please enter tarvel end_date");
      this.travel_end_date = '';
      return false;
    }

    console.log("travel_end_date - "+this.travel_end_date);
    console.log("travel_start_date - "+this.travel_start_date);
    if (this.travel_end_date < this.travel_start_date) {
      this.appCommon.presentAlert("End date should be greater than Start date");
      this.travel_end_date = '';
      return false;
    }


    if (this.reason == '' || this.reason == 'undefined' || this.reason == undefined) {
      this.appCommon.presentAlert("Please enter reason");
      this.reason = ''
      return false;
    }

    this.appCommon.presentLoader('Please Wait...');

    let url = 'appApplyOnDutyRequest&login_client_db=' + this.loginData['login_client_db'] + '&login_int_code=' + this.loginData['login_int_code'];
    url += '&travel_type=' + encodeURIComponent(this.travel_type) + '&visit_place=' + encodeURIComponent(this.visit_place);
    url += '&travel_start_date=' + this.travel_start_date + '&travel_end_date=' + this.travel_end_date + '&reason=' + encodeURIComponent(this.reason);

    this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)

        this.appCommon.presentAlert(data.data);

        this.appCommon.triggerNotification('on_duty_request','OnDutyRequestPage', this.loginData['login_client_db'], this.loginData['login_int_code']);

        this.employee = '';
        this.travel_type = '';
        this.travel_start_date = '';
        this.travel_end_date = '';
        this.reason = '';

        this.appCommon.dismissLoader();
        // this.viewCtrl.dismiss();

      }, (err) => {
        this.appCommon.presentAlert('Server Problem');
      }
    )
      return true;
  }
}
