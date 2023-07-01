import { Component } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
// import { GetService } from '../../app/app.getservice';
import { HttpserviceService } from '../../services/httpservice.service'; 
import { AppCommon } from '../../app.common';
import { IonicModule } from '@ionic/angular'; 
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'; 

// @IonicPage()
@Component({
  selector: 'page-approve-rh-request',
  templateUrl: 'approve-rh-request.html',
  styleUrls: ['approve-rh-request.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ] 
})
export class ApproveRhRequestPage {
  loginData: any;
  id: any;
  name: any;
  reason: any;
  rh: any;
  remarks: string;

  constructor(public navCtrl: NavController, 
    // public viewCtrl: ViewController,
    public loadingCtrl: LoadingController, public appCommon: AppCommon,
    public http: HttpserviceService,private route: ActivatedRoute
    // , public get: GetService
    ) {

    this.loginData = JSON.parse(localStorage.getItem('loginData'));

    this.id = this.route.snapshot.queryParams['int_code']; 
    this.name = this.id['emp_name'];
    this.reason = this.id['reason'];
    this.rh = this.id['holiday_name'];

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApproveRhRequestPage');
  }

  submit(approved_status) {

    if (this.remarks == '' || this.remarks == 'undefined' || this.remarks == undefined) {
      this.appCommon.presentAlert("Please enter remarks");
      this.remarks = ''
      return false;
    }

    this.appCommon.presentLoader('Please Wait...')

    let url = 'appApproveRejectRHRequest&login_client_db=' + this.loginData['login_client_db'] + '&login_int_code=' + this.loginData['login_int_code'];
    url += '&remarks=' + encodeURIComponent(this.remarks) + '&name=' + this.name + '&rh=' + this.rh + '&fin_year_code=' + this.id['fin_year_code'];
    url += '&emp_int_code=' + this.id['rh_employee_code'] + '&reason=' + encodeURIComponent(this.reason) + '&rh_code=' + this.id['holiday_code'];
    url += '&approved_status=' + approved_status + '&head_int_code=' + this.id['id'] + '&holiday_name=' + this.id['holiday_name'];

    this.http.postservice(url,'').subscribe(
      (res:any) => {
        let data = JSON.parse(res.data)

          this.appCommon.presentAlert(data.data);

          this.appCommon.triggerApprovalNotification(
            'rh_approval',
            this.loginData['login_client_db'],
            this.id['rh_employee_code'],
            encodeURIComponent(approved_status)
          )

          this.navCtrl.pop();

          this.appCommon.dismissLoader();

        }, (err) => {
          this.appCommon.presentAlert('Server Problem')
          this.appCommon.dismissLoader();
        }
      )
      return true
  }
}
