import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, LoadingController, ModalController } from '@ionic/angular';
import { AppCommon } from 'src/app/app.common';
import { HttpserviceService } from 'src/app/services/httpservice.service';
import { NavigationExtras } from '@angular/router';

// @IonicPage()
@Component({
  selector: 'page-on-duty-approval',
  templateUrl: 'on-duty-approval.html',
  styleUrls: ['on-duty-approval.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ]
})
export class OnDutyApprovalPage {
  loginData: any;
  applicants_list: any;
  loading_msg: string;

  constructor(public navCtrl: NavController, public appCommon: AppCommon,
    public http: HttpserviceService, public loadingCtrl: LoadingController, public modalCtrl: ModalController) {

    this.loginData = JSON.parse(localStorage.getItem('loginData'));
    this.loading_msg = 'Loading..'
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OnDutyApprovalPage');
  }

  getOnDutyApplicants() {
    this.appCommon.presentLoader('Please Wait...');
    let url = 'appGetOnDutyRequestApplicants&login_client_db=' + this.loginData['login_client_db'] + '&login_int_code=' + this.loginData['login_int_code'];
    url += '&is_super_wiser=' + this.loginData['is_super_wiser'];

    this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)
          this.applicants_list = data.data;

          if (this.applicants_list.length > 0)
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

  approveOnDutyRequest(int_code) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        int_code: int_code,
      }
    };

    this.navCtrl.navigateForward('menu/ApproveOnDutyPage',  navigationExtras );
  }

  ionViewDidEnter() {
    this.getOnDutyApplicants();
  }
}
