import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from '@ionic/angular';
import { AppCommon } from '../../app.common';
import { HttpserviceService } from '../../services/httpservice.service'; 
import { NavigationExtras } from '@angular/router';
import { IonicModule } from '@ionic/angular'; 
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

// @IonicPage()
@Component({
  selector: 'page-comp-off-request-approval',
  templateUrl: 'comp-off-request-approval.html',
  styleUrls: ['comp-off-request-approval.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ]
})
export class CompOffRequestApprovalPage {
  loginData: any;
  applicant_list: any;
  loading_msg: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
    // public get: GetService,
    public http: HttpserviceService, 
    public appCommon: AppCommon) {

    this.loginData = JSON.parse(localStorage.getItem('loginData'));
    this.loading_msg = 'Loading...';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CompOffRequestApprovalPage');
  }

  ionViewDidEnter() {
    this.getCompOffRequestApplicants();
  }

  getCompOffRequestApplicants() {
    this.appCommon.presentLoader('Please Wait...')
    let url = 'appGetCompOffRequestApplicants&login_client_db=' + this.loginData['login_client_db'];
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

  approveCompOffRequest(id) {

    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: id
      }
    };

    this.navCtrl.navigateForward('ApproveCompOffRequestPage', navigationExtras);
 
  }
}
