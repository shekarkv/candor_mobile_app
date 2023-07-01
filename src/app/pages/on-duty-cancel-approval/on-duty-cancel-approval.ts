import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, LoadingController, AlertController } from '@ionic/angular';
import { AppCommon } from 'src/app/app.common';
import { HttpserviceService } from 'src/app/services/httpservice.service';

// @IonicPage()
@Component({
  selector: 'page-on-duty-cancel-approval',
  templateUrl: 'on-duty-cancel-approval.html',
  styleUrls: ['on-duty-cancel-approval.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ]
})
export class OnDutyCancelApprovalPage {
  loginData: any;
  cancel_list: any;
  loading_msg: string;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController,
    public http: HttpserviceService, public appCommon: AppCommon, private alertCtrl: AlertController) {

    this.loginData = JSON.parse(localStorage.getItem('loginData'));
    this.loading_msg = 'Loading...';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OnDutyCancelApprovalPage');
  }

  ionViewDidEnter() {
    this.getOnDutyCancelList();
  }

  getOnDutyCancelList() {
    this.appCommon.presentLoader('Please Wait...');
    let url = 'appGetOnDutyCancelList&login_client_db=' + this.loginData['login_client_db'];
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

  async approveOnDutyCancellation(id) {

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

            let url = 'appApproveOnDutyCancelRequest&login_client_db=' + this.loginData['login_client_db'];
            url += '&head_int_code=' + id['id'] + '&fin_int_code=' + id['fin_int_code'];
            url += '&approved_remarks=' + encodeURIComponent(data.remarks) + '&login_int_code=' + this.loginData['login_int_code'];
            url += '&travel_type=' + encodeURIComponent(id['travel_type']);
            url += '&travel_start_date=' + id['travel_start_date'] + '&travel_end_date=' + id['travel_end_date'];
            url += '&approved_status=' + 'Approved';

              this.http.postservice(url, '').subscribe((res:any)=>{
                let data = JSON.parse(res.data)
                  this.appCommon.presentAlert(data.data);
                  this.appCommon.triggerApprovalNotification(
                    'cancel_on_duty_request_approval',
                    this.loginData['login_client_db'],
                    id['od_ref_employee_code'],
                    'Approved'
                  )
                    this.appCommon.dismissLoader();
                   
          
                  }, (err:any) => {
                    this.appCommon.presentAlert('Server Problem')
                    this.appCommon.dismissLoader();
                  }
                )
                return true;
          }
        }
      ]
    });
    (await alert).present();
  }
}
