import { Component } from '@angular/core';
import {  NavController,  AlertController, LoadingController } from '@ionic/angular';
import { AppCommon } from '../../app.common';
import { HttpserviceService } from '../../services/httpservice.service'; 
import { IonicModule } from '@ionic/angular'; 
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

// @IonicPage()
// @Component({
//   selector: 'page-leave-application-status',
//   templateUrl: 'leave-application-status.html',
// })
@Component({
  selector: 'app-leave-application-status',
  templateUrl: 'leave-application-status.html',
  styleUrls: ['leave-application-status.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule]
})


export class LeaveApplicationStatusPage {
  fin_List: any;
  leave_year: any;
  loginData: any;
  applicant_list: any;
  loading_msg: string;

  constructor(public navCtrl: NavController, 
    // public navParams: NavParams, 
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public http: HttpserviceService,
    public appCommon: AppCommon,
    private route: ActivatedRoute, private router: Router
  ) {

    this.loginData = JSON.parse(localStorage.getItem('loginData') || '');
    this.loading_msg = 'Loading...';
    // this.leave_year = navParams.get('year');
    this.leave_year = this.route.snapshot.queryParams['year']; 
    this.getLeaveYear();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LeaveApplicationStatusPage');
  }

  getLeaveYear() {

    let url = 'appGetLeaveYear&login_client_db=' + this.loginData['login_client_db'];
    this.http.postservice(url, '').subscribe((res:any)=>{
      
          let data = JSON.parse(res.data) 

          this.fin_List = data.data['leave_year_list'];

          this.leave_year = data['data']['cur_year'];

          console.log(data)
          this.getLeaveAppStatus();

        }, (err:any) => {

          this.appCommon.presentAlert('Server Problem')
        }
      )
  }

  getLeaveAppStatus() {

    // let loader = this.loadingCtrl.create({
      // content: 'Please wait'
    // })

    this.appCommon.presentLoader('Please Wait...')

    let url = 'appGetLeaveApplicationStatus&login_client_db=' + this.loginData['login_client_db'];
    url += '&year_code=' + this.leave_year + '&login_int_code=' + this.loginData['login_int_code'];

    this.http.postservice(url, '').subscribe((res:any)=>{

        let data = JSON.parse(res.data) 


        this.applicant_list = data.data;

        if (this.applicant_list.length > 0)
          this.loading_msg = 'loaded';
        else
          this.loading_msg = 'No Records Found';

          this.appCommon.dismissLoader();

      }, (err:any) => {
        this.appCommon.presentAlert('Server Problem');
      }
    )
  }
}
