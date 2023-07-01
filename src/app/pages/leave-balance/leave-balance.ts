import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, AlertController, LoadingController } from '@ionic/angular';
import { AppCommon } from 'src/app/app.common';
import { HttpserviceService } from 'src/app/services/httpservice.service';
import { ActivatedRoute } from '@angular/router';

// @IonicPage()
@Component({
  selector: 'page-leave-balance',
  templateUrl: 'leave-balance.html',
  styleUrls: ['leave-balance.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ],
  providers:[DatePipe]
})
export class LeaveBalancePage {
  loginData: any;
  fin_List: any;
  today: string;
  processed_month: string;
  processed_year: string;
  leave_list: any;
  loading_msg: any;
  home_month: any;
  home_year: any;
  from_page: string;

  constructor(public navCtrl: NavController, public http: HttpserviceService, public appCommon: AppCommon,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController, public datepipe: DatePipe, private route: ActivatedRoute) {

    this.loginData = JSON.parse(localStorage.getItem('loginData'));
    this.loading_msg = 'Loading...';

    this.from_page = 'current';
    this.from_page =  this.route.snapshot.queryParams['from_page']; 
    console.log("from_page - "+this.from_page);
    
    if (this.from_page == 'home') {
      this.today =this.route.snapshot.queryParams['date']; 
      this.getEmployeeLeaveBalance();
    }
    else {
      var cur_year = String(new Date().getFullYear());
      var cur_month = String(new Date().getMonth() + 1);
      if (cur_month.length < 2)
        cur_month = "0" + cur_month;
      var temp = cur_year.concat("-");
      this.today = temp.concat(cur_month);
      this.getEmployeeLeaveBalance();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LeaveBalancePage');
  }

  getEmployeeLeaveBalance() {
    this.appCommon.presentLoader('Please Wait...');
    var year = this.datepipe.transform(this.today, 'yyyy');
    var month = this.datepipe.transform(this.today, 'MM');

    let url = 'appGetEmployeeLeaveBalance&year=' + year + '&login_client_db=' + this.loginData['login_client_db'];
    url += '&month=' + month + '&login_int_code=' + this.loginData['login_int_code'];

    this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)
          this.leave_list = data.data['leave_arr'];

          if (this.leave_list.length > 0)
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
  changeLeaveData() {
    this.getEmployeeLeaveBalance();
  }
}
