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
  selector: 'page-approve-leave-applicant',
  templateUrl: 'approve-leave-applicant.html',
  styleUrls: ['approve-leave-applicant.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ]
})
export class ApproveLeaveApplicantPage {
  loginData: any;
  leave_id: any;
  emp_int_code: any;
  name: any;
  type: any;
  leave_type_int_code: any;
  from_date: any;
  to_date: any;
  to_half: any;
  from_half: any;
  appr_days: any;
  remarks: string;
  refresh: string;

  constructor(public navCtrl: NavController, 
    // public viewCtrl: ViewController,
    public loadingCtrl: LoadingController, public appCommon: AppCommon,
    public http: HttpserviceService,private route: ActivatedRoute
    //  public get: GetService, 
    // public events: Events
    ) {

    this.loginData = JSON.parse(localStorage.getItem('loginData'));
    

    // this.leave_id = navParams.get('leave_id');
    this.leave_id = this.route.snapshot.queryParams['leave_id']; 
    console.log("leave_id - "+JSON.stringify(this.leave_id));
    console.log("name - "+this.leave_id['leave_employee_name']);

    this.emp_int_code = this.leave_id['leave_ref_employee_code'];
    this.name = this.leave_id['leave_employee_name'];
    this.type = this.leave_id['leave_name'];
    this.leave_type_int_code = this.leave_id['leave_type'];
    this.from_date = this.leave_id['from_date'];
    this.to_date = this.leave_id['to_date'];
    this.from_half = this.leave_id['from_half_day'];
    this.to_half = this.leave_id['to_half_day'];
    this.appr_days = this.leave_id['no_of_days'];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApproveLeaveApplicantPage');
  }

  submit(approved_status) {
    this.appCommon.presentLoader('Please Wait...')

    let url = 'appApproveRejectLeaveApplication&login_client_db=' + this.loginData['login_client_db'] + '&login_int_code=' + this.loginData['login_int_code'];
    url += '&remarks=' + encodeURIComponent(this.remarks) + '&from_date=' + this.from_date + '&name=' + this.name + '&leave_type=' + this.type;
    url += '&to_date=' + this.to_date + '&from_half=' + this.from_half + '&to_half=' + this.to_half + '&appr_days=' + this.appr_days;
    url += '&emp_int_code=' + this.emp_int_code + '&approved_status=' + approved_status + '&leave_int_code=' + this.leave_id['id'];
    url += '&fin_int_code=' + this.leave_id['fin_year_code'] + '&leave_type_int_code=' + this.leave_type_int_code;

    this.http.postservice(url,'').subscribe(
      (res:any) => {
        let data = JSON.parse(res.data)
        this.appCommon.dismissLoader();
          this.appCommon.presentAlert(data.data);
          //do it in next release
          // this.events.publish('refresh-event');

          this.appCommon.triggerApprovalNotification(
            'leave_application_approval',
            this.loginData['login_client_db'],
            this.emp_int_code,
            approved_status
          )

          this.navCtrl.pop();

          this.appCommon.dismissLoader();

        }, (err) => {
          this.appCommon.presentAlert('Server Problem')
          this.appCommon.dismissLoader();
        }
      )
  }
}
