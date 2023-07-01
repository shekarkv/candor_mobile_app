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
  selector: 'page-approve-on-duty',
  templateUrl: 'approve-on-duty.html',
  styleUrls: ['approve-on-duty.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ]
})
export class ApproveOnDutyPage {
  int_code: any;
  loginData: any;
  name: any;
  travel_type: any;
  start_date: any;
  end_date: any;
  remarks: any;
  visit_place: any;

  constructor(public navCtrl: NavController, 
    // public viewCtrl: ViewController,
    public loadingCtrl: LoadingController, public appCommon: AppCommon, 
    public http: HttpserviceService,private route: ActivatedRoute
    // public get: GetService
    ) {

    this.loginData = JSON.parse(localStorage.getItem('loginData'));

    // this.int_code = navParams.get('int_code');
    this.int_code = this.route.snapshot.queryParams['int_code']; 
    this.name = this.int_code['od_employee_name'];
    this.travel_type = this.int_code['travel_type'];
    this.visit_place = this.int_code['visit_place'];
    this.start_date = this.int_code['travel_start_date'];
    this.end_date = this.int_code['travel_end_date'];
    this.remarks = this.int_code['approved_remarks']

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApproveOnDutyPage');
  }

  submit(approved_status) {

    if (this.remarks == '' || this.remarks == 'undefined' || this.remarks == undefined) {
      this.appCommon.presentAlert("Please enter remarks");
      this.remarks = ''
      return false;
    }

    this.appCommon.presentLoader('Please Wait...')

    let url = 'appApproveRejectOnDutyRequest&login_client_db=' + this.loginData['login_client_db'] + '&login_int_code=' + this.loginData['login_int_code'];
    url += '&remarks=' + encodeURIComponent(this.remarks) + '&travel_start_date=' + this.start_date + '&name=' + this.name + '&travel_type=' + this.travel_type;
    url += '&travel_end_date=' + this.end_date + '&emp_int_code=' + this.int_code['od_ref_employee_code'];
    url += '&approved_status=' + approved_status + '&travel_type_int_code=' + this.int_code['id'] + '&visit_place=' + this.visit_place;

    this.http.postservice(url,'').subscribe(
      (res:any) => {
        let data = JSON.parse(res.data)

          this.appCommon.presentAlert(data.data);

          this.appCommon.triggerApprovalNotification(
            'on_duty_approval',
            this.loginData['login_client_db'],
            this.int_code['od_ref_employee_code'],
            approved_status
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
