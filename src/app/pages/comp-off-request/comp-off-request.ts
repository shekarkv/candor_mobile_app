import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { HttpserviceService } from '../../services/httpservice.service'; 
import { AppCommon } from '../../app.common';
import { IonicModule } from '@ionic/angular'; 
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

// @IonicPage()
@Component({
  selector: 'page-comp-off-request',
  templateUrl: 'comp-off-request.html',
  styleUrls: ['comp-off-request.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ]
})
export class CompOffRequestPage {
  loginData: any;
  employee: any;
  applicant_list: any;
  loading_msg: string;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController,
    public http: HttpserviceService,
    public appCommon: AppCommon, private alertCtrl: AlertController,
    //  public viewCtrl: ViewController
     ) {

    this.loginData = JSON.parse(localStorage.getItem('loginData'));
    this.loading_msg = 'Loading...';
    this.getCompOffApplicants();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CompOffRequestPage');
  }

  getCompOffApplicants() {
    this.appCommon.presentLoader('Please Wait...')
    let url = 'appGetCompOffApplicants&login_client_db=' + this.loginData['login_client_db'];
    url += '&login_int_code=' + this.loginData['login_int_code'];

    this.http.postservice(url,'').subscribe(
      (res:any) => {
        let data = JSON.parse(res.data)

        this.applicant_list = data.data;

        if (this.applicant_list.length > 0)
          this.loading_msg = 'loaded';
        else
          this.loading_msg = 'No Records Found';

          this.appCommon.dismissLoader();

      }, (err) => {
        this.appCommon.presentAlert('Server Problem');
        this.appCommon.dismissLoader();
      }
    )
  }

  async applyCompOffRequest(int_code) {
  
    let alert = await this.alertCtrl.create({
      header: 'CompOff Request',
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
          text: 'CompOff Request',
          handler: data => {

            if (data.reason == '' || data.reason == 'undefined' || data.reason == undefined) {
              this.appCommon.presentAlert("Please enter reason");
              data.reason = '';
              return false;
            }

            this.appCommon.presentLoader('Please Wait...');

            let url = 'appCompOffRequest&login_client_db=' + this.loginData['login_client_db'];
            url += '&head_int_code=' + int_code['id'] + '&fin_int_code=' + int_code['fin_int_code'] + '&date=' + int_code['display_date'];
            url += '&login_int_code=' + this.loginData['login_int_code'] + '&worked_holiday_date=' + int_code['worked_holiday_date'];
            url += '&cancel_reason=' + encodeURIComponent(data.reason) + '&emp_code=' + int_code['comp_ref_employee_code'];
            this.http.postservice(url, '').subscribe(
              (res: any) => {
                let data = JSON.parse(res.data);
                this.appCommon.presentAlert(data.data);

                this.appCommon.triggerNotification('compoff_request', 'CompOffRequestPage', this.loginData['login_client_db'], this.loginData['login_int_code']);

                // this.viewCtrl.dismiss();
                console.log(data);
                this.appCommon.dismissLoader();

              }, (err) => {
                this.appCommon.presentAlert('Server Problem');
                this.appCommon.dismissLoader();
              }
            );
            return true;
          }
        }
      ]
    });
    await alert.present();
  }
}
