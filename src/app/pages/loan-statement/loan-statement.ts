import { Component } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
// import { GetService } from '../../app/app.getservice';
import { AppCommon } from '../../app.common';
import { HttpserviceService } from '../../services/httpservice.service'; 
import { DatePipe } from '@angular/common';
import { IonicModule } from '@ionic/angular'; 
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'page-loan-statement',
  templateUrl: 'loan-statement.html',
  styleUrls: ['loan-statement.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ],
  providers: [DatePipe]
})
export class LoanStatementPage {
  yearList: any;
  fyear: any;
  loading_msg: string;
  loginData: any;
  login_client_db: any;
  loan_arr: any;
  processed_month: string;
  today: string;
  processed_year: any;

  constructor(public navCtrl: NavController, 
    // public get: GetService,
    public http: HttpserviceService,
    public loadingCtrl: LoadingController, public appCommon: AppCommon, public datepipe: DatePipe) {

    this.loading_msg = 'Loading...';
    this.loginData = JSON.parse(localStorage.getItem('loginData'));
    this.login_client_db = this.loginData['login_client_db'];

    var cur_year = String(new Date().getFullYear());
    var cur_month = String(new Date().getMonth() + 1);
    if (cur_month.length < 2)
      cur_month = "0" + cur_month;
    var temp = cur_year.concat("-");
    this.today = temp.concat(cur_month);

    this.getLoanStatement();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoanStatementPage');
  }

  getLoanStatement() {
    this.appCommon.presentLoader('Please Wait...');

    var year = this.datepipe.transform(this.today, 'yyyy');
    var month = this.datepipe.transform(this.today, 'MM');

    let url = 'appGetLoanStatement&login_client_db=' + this.login_client_db + '&login_int_code=' + this.loginData['login_int_code'];
    url += '&year=' + year + '&month=' + month;

    this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)

          this.loan_arr = data.data;

          if (this.loan_arr.length > 0)
            this.loading_msg = 'Loaded';
          else
            this.loading_msg = 'No Records Found';

          console.log(data)
          this.appCommon.dismissLoader();

        }, (err) => {
          this.appCommon.presentAlert('Server Problem')
          this.appCommon.dismissLoader();
        }
      )
  }

  changeEmpLoanData() {
    this.getLoanStatement();
  }

  getLoanData(id) {

    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: id
      }
    };

    // this.navCtrl.push('LoanDescriptionPage', { id: id })
    this.navCtrl.navigateForward('LoanDescriptionPage', navigationExtras );
  }

}
