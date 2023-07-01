import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, AlertController, LoadingController } from '@ionic/angular';
import { AppCommon } from 'src/app/app.common';
import { HttpserviceService } from 'src/app/services/httpservice.service';

// @IonicPage()
@Component({
  selector: 'page-leave-application',
  templateUrl: 'leave-application.html',
  styleUrls: ['leave-application.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ],
  providers:[DatePipe]
})
export class LeaveApplicationPage {
  emp_list: any;
  leave_type: any;
  from_date: string;
  to_date: string;
  from_half: string = 'No';
  to_half: string= 'No';
  no_of_days: any;
  loginData: any;
  bal: any;
  leave: string;
  reason: string;
  employee: any;
  No:any = 'No';
  Yes:any = 'Yes';

  constructor(public navCtrl: NavController, public http: HttpserviceService, public appCommon: AppCommon,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController, public datepipe: DatePipe) {

    this.loginData = JSON.parse(localStorage.getItem('loginData'));
    this.employee = this.loginData['login_name'];
    this.getAllEmployeeList();
    this.getLeaveType();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LeaveApplicationPage');
  }

  getAllEmployeeList() {
    this.appCommon.presentLoader('Please Wait...');

    let url = 'appGetAllEmployeeList&login_client_db=' + this.loginData['login_client_db'] + '&login_int_code=' + this.loginData['login_int_code'];

    this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)
          this.emp_list = data['data']['emp_list'];
          this.appCommon.dismissLoader();

        }, (err:any) => {
          this.appCommon.presentAlert('Server Problem')
          this.appCommon.dismissLoader();
        }
      )
  }

  getLeaveType() {

    let url = 'appGetLeaveType&login_client_db=' + this.loginData['login_client_db'];

    this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)
      this.leave_type = data['data'];

        }, (err:any) => {
          this.appCommon.presentAlert('Server Problem')
        }
      )
  }

  calculateNoOfDays($event) {

    let url = 'appCalculateNoOfDays&from_date=' + this.from_date + '&to_date=' + this.to_date + '&from_half_day=' + encodeURIComponent(this.from_half);
    url += '&to_half_day=' + encodeURIComponent(this.to_half) + '&login_client_db=' + this.loginData['login_client_db'] + '&leave_type=' + this.leave;
    url += '&ref_employee_code=' + this.loginData['login_int_code'];

    this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)
      this.no_of_days = data['data'];

        }, (err:any) => {
          this.appCommon.presentAlert('Server Problem')
        }
      )

  }
  displayLeaveBalance($event) {

    let url = 'appDisplayLeaveBalance&leave_type=' + this.leave + '&login_client_db=' + this.loginData['login_client_db'];
    url += '&to_date=' + this.to_date + '&l_emp_code=' + this.loginData['login_int_code'];

    this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)
      this.bal = data['data'];

        }, (err:any) => {
          this.appCommon.presentAlert('Server Problem')
        }
      )
  }

  applyLeave() {

    if (this.reason == '' || this.reason == 'undefined' || this.reason == undefined) {
      this.appCommon.presentAlert("Please enter reason");
      this.reason = '';
      return false;
    }

    this.appCommon.presentLoader('Please Wait...');

    let url = 'appApplyLeave&leave=' + this.leave + '&login_client_db=' + this.loginData['login_client_db'] + '&from_date=' + this.from_date;
    url += '&to_date=' + this.to_date + '&from_half=' + this.from_half + '&to_half=' + this.to_half + '&reason=' + encodeURIComponent(this.reason);
    url += '&no_of_days=' + this.no_of_days + '&bal=' + this.bal + '&login_int_code=' + this.loginData['login_int_code'];

    this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)
          this.appCommon.presentAlert(data.data);

          this.appCommon.triggerNotification('leave_application', 'LeaveApplicationPage' , this.loginData['login_client_db'], this.loginData['login_int_code']);

          // this.employee = '';
          // this.leave = '';
          // this.from_date = '';
          // this.from_half = '';
          // this.to_date = '';
          // this.to_half = '';
          // this.reason = '';
          // this.no_of_days = '';
          // this.bal = '';
          this.appCommon.dismissLoader();

        }, (err:any) => {
          this.appCommon.presentAlert('Server Problem')
          this.appCommon.dismissLoader();
        }
      )
      return true;
  }

  cancel() {
    this.employee = '';
    this.leave = '';
    this.from_date = '';
    this.from_half = '';
    this.to_date = '';
    this.to_half = '';
    this.reason = '';
    this.no_of_days = '';
    this.bal = '';

    this.appCommon.dismissLoader();
  }
}
