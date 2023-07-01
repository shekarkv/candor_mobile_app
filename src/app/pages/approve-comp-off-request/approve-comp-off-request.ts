import { Component } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
// import { GetService } from '../../app/app.getservice';
import { AppCommon } from '../../app.common';
import { IonicModule } from '@ionic/angular'; 
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { HttpserviceService } from '../../services/httpservice.service'; 
import { ActivatedRoute, Router } from '@angular/router'; 

// @IonicPage()
@Component({
  selector: 'page-approve-comp-off-request',
  templateUrl: 'approve-comp-off-request.html',
  styleUrls: ['approve-comp-off-request.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ]
})
export class ApproveCompOffRequestPage {
  id: any;
  loginData: any;
  name: any;
  remarks: string;
  req_date: any;

  constructor(public navCtrl: NavController, 
    // , public get: GetService
    public http: HttpserviceService,
    public appCommon: AppCommon, public loadingCtrl: LoadingController,
    private route: ActivatedRoute
    // , public viewCtrl: ViewController
    ) {

    this.loginData = JSON.parse(localStorage.getItem('loginData'));

    // this.id = navParams.get('id');

    this.id = this.route.snapshot.queryParams['id']; 
    this.name = this.id['comp_emp_name'];
    this.req_date = this.id['requesting_date'];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApproveCompOffRequestPage');
  }

  submit(approved_status) {
    if (this.remarks == '' || this.remarks == 'undefined' || this.remarks == undefined) {
      this.appCommon.presentAlert("Please enter remarks")
      this.remarks = ''
      return false;
    }

    this.appCommon.presentLoader('Please Wait...')

    let url = 'appApproveRejectCompOffRequest&login_client_db=' + this.loginData['login_client_db'] + '&head_int_code=' + this.id['id'];
    url += '&login_int_code=' + this.loginData['login_int_code'] + '&fin_int_code=' + this.id['fin_int_code'];
    url += '&emp_int_code=' + this.id['comp_emp_code'] + '&remarks=' + encodeURIComponent(this.remarks);
    url += '&approved_status=' + encodeURIComponent(approved_status) + '&group_int_code=' + this.id['group_int_code'];
    url += '&holiday_date=' + this.id['holiday_date'];

    this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)

          this.appCommon.presentAlert(data.data);

          this.appCommon.triggerApprovalNotification(
            'compoff_approval',
            this.loginData['login_client_db'],
            this.id['comp_emp_code'],
            approved_status
          )

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
}
