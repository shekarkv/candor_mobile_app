import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, LoadingController, NavController } from '@ionic/angular';
import { AppCommon } from 'src/app/app.common';
import { HttpserviceService } from 'src/app/services/httpservice.service';

@Component({
  selector: 'page-rh-cancel-approval',
  templateUrl: 'rh-cancel-approval.html',
  styleUrls: ['rh-cancel-approval.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ]
})
export class RhCancelApprovalPage {
  loginData: any;
  cancel_list: any;
  loading_msg: string;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController,
    public http: HttpserviceService, public appCommon: AppCommon, private alertCtrl: AlertController) {

    this.loginData = JSON.parse(localStorage.getItem('loginData'));
    this.loading_msg = 'Loading...';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RhCancelApprovalPage');
  }

  ionViewDidEnter() {
    this.getRHCancelList();
  }

  getRHCancelList() {
    this.appCommon.presentLoader('Please Wait...');

    let url = 'appGetRHCancelList&login_client_db=' + this.loginData['login_client_db'];
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

  async approveRHCancellation(id) {

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
            let url = 'appApproveRHCancelRequest&login_client_db=' + this.loginData['login_client_db'];
            url += '&head_int_code=' + id['id'] + '&fin_int_code=' + id['fin_year_code'];
            url += '&approved_remarks=' + encodeURIComponent(data.remarks) + '&login_int_code=' + this.loginData['login_int_code'];
            url += '&holiday_name=' + encodeURIComponent(id['holiday_name']);
            url += '&approved_status=' + 'Approved' + '&holiday_code=' + id['holiday_code'];

              this.http.postservice(url, '').subscribe((res:any)=>{
                let data = JSON.parse(res.data)

                this.appCommon.triggerApprovalNotification(
                  'cancel_rh_request_approval',
                  this.loginData['login_client_db'],
                  id['rh_employee_code'],
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
