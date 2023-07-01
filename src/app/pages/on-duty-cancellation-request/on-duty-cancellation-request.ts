import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, LoadingController, AlertController } from '@ionic/angular';
import { AppCommon } from 'src/app/app.common';
import { HttpserviceService } from 'src/app/services/httpservice.service';
// @IonicPage()
@Component({
  selector: 'page-on-duty-cancellation-request',
  templateUrl: 'on-duty-cancellation-request.html',
  styleUrls: ['on-duty-cancellation-request.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ]
})
export class OnDutyCancellationRequestPage {
  loginData: any;
  cancel_list: any;
  loading_msg: string;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController,
    public http: HttpserviceService, public appCommon: AppCommon, private alertCtrl: AlertController) {

    this.loginData = JSON.parse(localStorage.getItem('loginData'));
    this.loading_msg = 'Loading...';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OnDutyCancellationRequestPage');
  }

  ionViewDidEnter() {
    this.getCancelOnDutyRequests();
  }

  getCancelOnDutyRequests() {
    this.appCommon.presentLoader('Please Wait...');
    let url = 'appGetOnDutyCancellationRequests&login_client_db=' + this.loginData['login_client_db'];
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

  async cancelOnDutyRequest(int_code) {
    let alert = this.alertCtrl.create({
      header: 'Cancel Request',
      inputs: [
        {
          name: 'reason',
          placeholder: 'reason'
        }
      ],
      buttons: [
        {
          text: 'close',
          role: 'close',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Cancel Request',
          handler: data => {

            if (data.reason == '' || data.reason == 'undefined' || data.reason == undefined) {
              this.appCommon.presentAlert("Please enter reason");
              data.reason = '';
              return false;
            }

            this.appCommon.presentLoader('Please Wait...');
            let url = 'appCancelOnDutyRequest&login_client_db=' + this.loginData['login_client_db'];
            url += '&head_int_code=' + int_code['id'] + '&fin_int_code=' + int_code['fin_int_code'];
            url += '&cancel_reason=' + encodeURIComponent(data.reason) + '&login_int_code=' + this.loginData['login_int_code'];
            url += '&travel_type=' + int_code['travel_type'] + '&travel_start_date=' + int_code['travel_start_date'];
            url += '&travel_end_date=' + int_code['travel_end_date']

              this.http.postservice(url, '').subscribe((res:any)=>{
                let data = JSON.parse(res.data)
                this.appCommon.presentAlert(data.data);

                this.appCommon.triggerNotification('cancel_on_duty_request', 'OnDutyCancellationRequestPage' ,this.loginData['login_client_db'], this.loginData['login_int_code']);
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
