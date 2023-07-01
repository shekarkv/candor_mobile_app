import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, LoadingController, AlertController } from '@ionic/angular';
import { AppCommon } from 'src/app/app.common';
import { HttpserviceService } from 'src/app/services/httpservice.service';

// @IonicPage()
@Component({
  selector: 'page-leave-cancellation-approval',
  templateUrl: 'leave-cancellation-approval.html',
  styleUrls: ['leave-cancellation-approval.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ]
})
export class LeaveCancellationApprovalPage {
  loginData: any;
  cancel_list: any;
  status: any;
  loading_msg: any;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController,
    public http: HttpserviceService, public appCommon: AppCommon, private alertCtrl: AlertController) {

    this.loginData = JSON.parse(localStorage.getItem('loginData'));
    this.loading_msg = 'Loading..';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LeaveCancellationApprovalPage');
  }

  ionViewDidEnter() {
    this.getAllLeaveRequests();
  }

  getAllLeaveRequests() {
    
    this.appCommon.presentLoader('Please Wait...');
    let url = 'appGetAllLeaveRequests&login_client_db=' + this.loginData['login_client_db'];
    url += '&login_int_code=' + this.loginData['login_int_code'];

    this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)
          this.cancel_list = data.data;

          if (this.cancel_list.length > 0)
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

  async approveLeaveCancellation(int_code) {
    let alert = this.alertCtrl.create({
      header: 'Cancel Request',
      inputs: [
        {
          name: 'remarks',
          placeholder: 'Cancellation Approval Remarks'
        }
      ],
      buttons: [
        {
          text: 'Reject',
          role: 'reject',
          handler: data => {
            console.log('reject clicked')
          }
        },
        {
          text: 'Approve',
          handler: data => {

            if (data.remarks == '' || data.remarks == 'undefined' || data.remarks == undefined) {
              this.appCommon.presentAlert("Please enter remarks");
              data.remarks = '';
              return false;
            }

            this.appCommon.presentLoader('Please Wait...');
            let url = 'appApproveLeaveCancelRequest&login_client_db=' + this.loginData['login_client_db'];
            url += '&head_int_code=' + int_code['id'] + '&fin_int_code=' + int_code['fin_int_code'];
            url += '&approved_remarks=' + encodeURIComponent(data.remarks) + '&login_int_code=' + this.loginData['login_int_code'];
            url += '&leave_name=' + encodeURIComponent(int_code['leave_name']) + '&leave_type_code=' + int_code['leave_type'];
            url += '&approved_days=' + int_code['approved_days'] + '&emp_int_code=' + int_code['leave_ref_employee_code'];
            url += '&approved_status=' + 'Approved' + '&from_date=' + int_code['from_date'] + '&to_date=' + int_code['to_date'];

              this.http.postservice(url, '').subscribe((res:any)=>{
                let data = JSON.parse(res.data)
                  this.appCommon.presentAlert(data.data);

                  this.appCommon.triggerApprovalNotification(
                    'cancel_leave_request_approval',
                    this.loginData['login_client_db'],
                    int_code['leave_ref_employee_code'],
                    'Approved'
                  )
                    this.appCommon.dismissLoader();
                   
          
                  }, (err:any) => {
                    this.appCommon.presentAlert('Server Problem')
                    this.appCommon.dismissLoader();
                  }
                )
                return true
          }
        }
      ]
    });
    (await alert).present();
  }
}
