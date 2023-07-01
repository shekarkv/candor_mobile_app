import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from '@ionic/angular';
import { AppCommon } from '../../app.common';
import { HttpserviceService } from '../../services/httpservice.service';  
import { IonicModule } from '@ionic/angular'; 
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { NavigationExtras } from '@angular/router';


@Component({
  selector: 'page-holiday-work-permit-approval',
  templateUrl: 'holiday-work-permit-approval.html',
  styleUrls: ['holiday-work-permit-approval.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ]
})
export class HolidayWorkPermitApprovalPage {
  loginData: any;
  applicant_list: any;
  loading_msg: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
    // public get: GetService, 
    public http: HttpserviceService,
    public appCommon: AppCommon) {

    this.loginData = JSON.parse(localStorage.getItem('loginData'));
    this.loading_msg = 'Loading...';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HolidayWorkPermitApprovalPage');
  }

  ionViewDidEnter() {
    this.getHWPermitApplicants();
  }

  getHWPermitApplicants() {
    this.appCommon.presentLoader('Please Wait...')

    let url = 'appGetHWPermitApplicants&login_client_db=' + this.loginData['login_client_db'] + '&login_int_code=' + this.loginData['login_int_code'];
    url += '&is_super_wiser=' + this.loginData['is_super_wiser'];

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

  approveApplicant(int_code) { 

    let navigationExtras: NavigationExtras = {
      queryParams: {
        int_code: int_code
      }
    };

    this.navCtrl.navigateForward('ApproveHwPermitPage', navigationExtras);
  }
}
