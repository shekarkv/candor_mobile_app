import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, LoadingController } from '@ionic/angular';
import { AppCommon } from 'src/app/app.common';
import { HttpserviceService } from 'src/app/services/httpservice.service';
import { NavigationExtras } from '@angular/router';

// @IonicPage()
@Component({
  selector: 'page-leave-application-approval',
  templateUrl: 'leave-application-approval.html',
  styleUrls: ['leave-application-approval.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ]
})
export class LeaveApplicationApprovalPage {
  loginData: any;
  applicant_list: any;
  loading_msg: any;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController,
    public http: HttpserviceService, public appCommon: AppCommon) {

    this.loginData = JSON.parse(localStorage.getItem('loginData'));
    this.loading_msg = 'loading...';

     //do it in next release
    // this.events.subscribe('refresh-event', () => {
    //  this.getAllLeaveApplicants()
    // });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LeaveApplicationApprovalPage');
  }

  ionViewDidEnter() {
    this.getAllLeaveApplicants();
  }
  
  getAllLeaveApplicants() {
    this.appCommon.presentLoader('Please Wait...');
    let url = 'appGetLeaveApplicants&login_client_db=' + this.loginData['login_client_db'] + '&login_int_code=' + this.loginData['login_int_code'];
    url += '&is_super_wiser=' + this.loginData['is_super_wiser'];

    this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)
          this.applicant_list = data.data;

          if (this.applicant_list.length > 0)
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

  approveApplicant(leave_data) {
    console.log("leave_data - "+JSON.stringify(leave_data));
    // this.navCtrl.push('ApproveLeaveApplicantPage', { leave_id: int_code });
    let navigationExtras: NavigationExtras = {
      queryParams: {
        leave_id: leave_data,
      }
    };

    this.navCtrl.navigateForward('menu/ApproveLeaveApplicantPage',  navigationExtras );
  }
}
