import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, LoadingController, NavController } from '@ionic/angular';
import { AppCommon } from 'src/app/app.common';
import { HttpserviceService } from 'src/app/services/httpservice.service';

@Component({
  selector: 'page-rh-request-cancellation',
  templateUrl: 'rh-request-cancellation.html',
  styleUrls: ['rh-request-cancellation.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ]
})
export class RhRequestCancellationPage {
  loginData: any;
  cancel_list: any;
  loading_msg: string;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController,
    public http: HttpserviceService,public appCommon: AppCommon, private alertCtrl: AlertController) {

    this.loginData = JSON.parse(localStorage.getItem('loginData'));
    this.loading_msg = 'Loading...';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RhRequestCancellationPage');
  }

  ionViewDidEnter() {
    this.getRHCancelRequestList();
  }

  getRHCancelRequestList() {
    this.appCommon.presentLoader('Please Wait...');
    let url = 'appGetRHCancelRequestList&login_client_db=' + this.loginData['login_client_db'];
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

  async cancelRHRequest(id) {
    const alert = this.alertCtrl.create({ 
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
          handler: (blah) => {
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
            let url = 'appCancelRHRequest&login_client_db=' + this.loginData['login_client_db'];
            url += '&head_int_code=' + id['id'] + '&fin_int_code=' + id['fin_year_code'];
            url += '&cancel_reason=' + encodeURIComponent(data.reason) + '&login_int_code=' + this.loginData['login_int_code'];
            url += '&holiday_name=' + id['holiday_name'] + '&holiday_code=' + id['holiday_code'];

              this.http.postservice(url, '').subscribe((res:any)=>{
                let data = JSON.parse(res.data)
                this.appCommon.triggerNotification('cancel_rh_request', 'RhRequestCancellationPage', this.loginData['login_client_db'], this.loginData['login_int_code']);
                  console.log(data)
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
