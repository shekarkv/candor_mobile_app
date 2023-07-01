import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IonicModule, LoadingController, NavController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HttpserviceService } from 'src/app/services/httpservice.service';
import { AppCommon } from 'src/app/app.common';
import { NavigationExtras } from '@angular/router';

// @IonicPage()
@Component({
  selector: 'page-reimbursement-claims',
  templateUrl: 'reimbursement-claims.html',
  styleUrls: ['reimbursement-claims.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ],
  providers:[DatePipe]
})
export class ReimbursementClaimsPage {
  loginData: any;
  loading_msg: string;
  today: string;
  data_arr: any;
  year: string;
  month: string;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController,
    public http: HttpserviceService, public appCommon: AppCommon, public datepipe: DatePipe) {

    this.loginData = JSON.parse(localStorage.getItem('loginData'));

    var cur_year = String(new Date().getFullYear());
    var cur_month = String(new Date().getMonth() + 1);
    if (cur_month.length < 2)
      cur_month = "0" + cur_month;
    var temp = cur_year.concat("-");
    this.today = temp.concat(cur_month);

    this.getReimbursementClaims();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReimbursementClaimsPage');
  }

  getReimbursementClaims() {
    this.appCommon.presentLoader('Please Wait...');

    this.year = this.datepipe.transform(this.today, 'yyyy');
    this.month = this.datepipe.transform(this.today, 'MM');


    let url = 'appGetReimbursementClaims&login_client_db=' + this.loginData['login_client_db'];
    url += '&login_int_code=' + this.loginData['login_int_code'] + '&year=' + this.year + '&month=' + this.month;

    this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)
          this.data_arr = data.data['reim_data'];
          this.appCommon.dismissLoader();
         

        }, (err:any) => {
          this.appCommon.presentAlert('Server Problem')
          this.appCommon.dismissLoader();
        }
      )
  }

  changeReimbursementData() {
    this.getReimbursementClaims();
  }

  viewReimbursementData(id) {

    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: id,
        year: this.year,
        month: this.month
      }
    };

    this.navCtrl.navigateForward('menu/ViewReimbursementDataPage',  navigationExtras );
  }

  
}
