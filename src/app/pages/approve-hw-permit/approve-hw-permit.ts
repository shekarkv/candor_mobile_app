import { Component } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
// import { GetService } from '../../app/app.getservice';
import { AppCommon } from '../../app.common';
import { IonicModule } from '@ionic/angular'; 
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { HttpserviceService } from '../../services/httpservice.service'; 
import { NavigationExtras } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router'; 

// @IonicPage()
@Component({
  selector: 'page-approve-hw-permit',
  templateUrl: 'approve-hw-permit.html',
  styleUrls: ['approve-hw-permit.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ]
})
export class ApproveHwPermitPage {
  loginData: any;
  remarks: string;
  req_emp: string;
  reason: string;
  date_of_work: string;
  int_code: any;
  emp_int_code: any;
  head_int_code: any;
  display_date_of_work: any;
  approved_status: any;

  constructor(public navCtrl: NavController,
    //public get: GetService,
    public appCommon: AppCommon, public loadingCtrl: LoadingController,
    public http: HttpserviceService,private route: ActivatedRoute
    // , public viewCtrl: ViewController
    ) {

    this.loginData = JSON.parse(localStorage.getItem('loginData'));

    // this.int_code = navParams.get('int_code');
    this.int_code = this.route.snapshot.queryParams['int_code']; 
    this.emp_int_code = this.int_code['leave_ref_employee_code'];
    this.req_emp = this.int_code['emp_name'];
    this.date_of_work = this.int_code['date_of_work'];
    this.display_date_of_work = this.int_code['display_date_of_work'];
    this.reason = this.int_code['reason'];
    this.head_int_code = this.int_code['head_int_code'];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApproveHwPermitPage');
  }

  viewHwEmployees() {

    let navigationExtras: NavigationExtras = {
      queryParams: {
        head_int_code: this.head_int_code
      }
    };

    this.navCtrl.navigateForward('ViewHwEmployeesPage', navigationExtras);
  }

  submit(status) {

    this.approved_status = status;

    if (this.remarks == '' || this.remarks == 'undefined' || this.remarks == undefined) {
      this.appCommon.presentAlert("Please enter remarks")
      this.remarks = ''
      return false;
    }

    this.appCommon.presentLoader('Please Wait...')

    let url = 'appApproveRejectHWPermit&login_client_db=' + this.loginData['login_client_db'] + '&head_int_code=' + this.head_int_code;
    url += '&login_int_code=' + this.loginData['login_int_code'] + '&fin_int_code=' + this.int_code['fin_int_code'];
    url += '&emp_int_code=' + this.emp_int_code + '&remarks=' + encodeURIComponent(this.remarks);
    url += '&approved_status=' + encodeURIComponent(this.approved_status) + '&date_of_work=' + this.date_of_work;

    this.http.postservice(url,'').subscribe(
      (res:any) => {
        let data = JSON.parse(res.data)

          this.appCommon.presentAlert(data.data);

          this.triggerBulkApprovalNotification();

          // this.viewCtrl.dismiss();

          console.log(data);
          this.appCommon.dismissLoader();
        }, (err) => {
          this.appCommon.presentAlert('Server Problem')
          this.appCommon.dismissLoader();
        }
      )
      return true;
  }

  triggerBulkApprovalNotification() {
    let url = 'appTriggerBulkApprovalNotification&module=' + 'hw_permit_approval' + '&client_db=' + this.loginData['login_client_db'];
    url += '&emp_int_code=' + this.emp_int_code + '&approved_status=' + this.approved_status + '&head_int_code=' + this.head_int_code;
    
    this.http.postservice(url,'').subscribe(
      (res:any) => {
        let data = JSON.parse(res.data)

        console.log(data);

      }, (err) => {
        console.log(err);
      }
    )
  }
}
