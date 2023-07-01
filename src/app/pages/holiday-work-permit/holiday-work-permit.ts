import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from '@ionic/angular';
import { AppCommon } from '../../app.common';
import { HttpserviceService } from '../../services/httpservice.service';  
import { IonicModule } from '@ionic/angular'; 
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'page-holiday-work-permit',
  templateUrl: 'holiday-work-permit.html',
  styleUrls: ['holiday-work-permit.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ]
})
export class HolidayWorkPermitPage {
  loginData: any;
  req_emp: any;
  emp_list: any;
  employee: string;
  date_of_work: string;
  reason: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public appCommon: AppCommon, public loadingCtrl: LoadingController,
    public http: HttpserviceService,) {

    this.loginData = JSON.parse(localStorage.getItem('loginData'));
    this.req_emp = this.loginData['login_name'];
    this.getAllEmployeeList();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HolidayWorkPermitPage');
  }

  getAllEmployeeList() {

    this.appCommon.presentLoader('Please Wait...')

    let url = 'appGetAllEmployeeList&login_client_db=' + this.loginData['login_client_db'];
    url += '&login_int_code=' + this.loginData['login_int_code'];

    this.http.postservice(url,'').subscribe(
      (res:any) => {
        let data = JSON.parse(res.data)

        this.emp_list = data['data']['emp_list'];

        this.employee = this.loginData['login_name'];

        this.appCommon.dismissLoader(); 
      }, (err) => {
        this.appCommon.presentAlert('Server Problem');
        this.appCommon.dismissLoader(); 
      }
    )
  }

  Submit() {

    if (this.employee == '' || this.employee == 'undefined' || this.employee == undefined) {
      this.appCommon.presentAlert("Please select employee")
      this.employee = ''
      return false;
    }

    if (this.date_of_work == '' || this.date_of_work == 'undefined' || this.date_of_work == undefined) {
      this.appCommon.presentAlert("Please select Date of work")
      this.date_of_work = ''
      return false;
    }

    if (this.reason == '' || this.reason == 'undefined' || this.reason == undefined) {
      this.appCommon.presentAlert("Please enter reason")
      this.reason = ''
      return false;
    }

    this.appCommon.presentLoader('Please Wait...')

    let url = 'appApplyHolidayWorkPermit&login_client_db=' + this.loginData['login_client_db'] + '&req_emp=' + this.req_emp;
    url += '&login_int_code=' + this.loginData['login_int_code'] + '&date_of_work=' + this.date_of_work;
    url += '&employee=' + encodeURIComponent(JSON.stringify(this.employee)) + '&reason=' + encodeURIComponent(this.reason);

    this.http.postservice(url,'').subscribe(
      (res:any) => {
        let data = JSON.parse(res.data)

          this.appCommon.presentAlert(data.data);

          this.req_emp = '';
          this.employee = '';
          this.date_of_work = '';
          this.reason = '';

          // this.viewCtrl.dismiss();

          console.log(data);
          this.appCommon.dismissLoader(); 
        }, (err) => {
          this.appCommon.presentAlert('Server Problem')
          this.appCommon.dismissLoader(); 
        }
      )
      return true
  }
}
