import { Component } from '@angular/core';
import { IonicModule, NavController, AlertController, LoadingController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
// import { GetService } from '../../app/app.getservice';
import { AppCommon } from '../../app.common';
import { HttpserviceService } from '../../services/httpservice.service'; 
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

// @IonicPage()
@Component({
  selector: 'page-pf-ytd-statement',
  templateUrl: 'pf-ytd-statement.html',
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ],
  providers: [ DatePipe]
})
export class PfYtdStatementPage {
  loginData: any;
  login_client_db: any;
  login_int_code: any;
  login_password: any;
  login_name: any;
  login_company: any;
  yearList: any;
  fyear: any;
  pf_ytd_list: any;
  pf_ytd_statement_flag: any;
  emp_code: any;
  emp_name: any;
  emp_doj: any;
  emp_pf_no: any;
  pf_data: any;
  loading_msg: any;
  login_type: any;

  constructor(public navCtrl: NavController, public datepipe: DatePipe,
    public loadingCtrl: LoadingController, 
    public http: HttpserviceService,
    public alertCtrl: AlertController,
    public appCommon: AppCommon) {

    this.loading_msg = 'Loading...';

    this.loginData = JSON.parse(localStorage.getItem('loginData') || '');
    this.login_client_db = this.loginData['login_client_db'];
    this.login_int_code = this.loginData['login_int_code'];
    this.login_name = this.loginData['login_name'];
    this.login_password = this.loginData['login_password'];
    this.login_company = this.loginData['login_company'];
    this.login_type = this.loginData['login_type'];

    this.getAllFinancialYear();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PfYtdStatementPage');
  }

  getAllFinancialYear() {
    this.appCommon.presentLoader('Please Wait...');
    let url = 'appGetAllFinancialYear&login_client_db=' + this.login_client_db;
    this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)

          this.yearList = data.data['fin_year_list'];
          this.fyear = data['data']['cur_fin_year_code'];
          this.appCommon.dismissLoader();
          this.getPfYtdStatement();
        }, (err:any) => {
          this.appCommon.presentAlert('Server Problem')
          this.appCommon.dismissLoader();
        }
      )
  }

  getPfYtdStatement() {
    this.appCommon.presentLoader('Please Wait...');
    let url = 'appGetPfYtdStatement&login_client_db=' + this.login_client_db + '&fin_year=' + this.fyear + '&login_int_code=' + this.login_int_code;
    this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)
          this.emp_code = data['data']['emp_code'];
          this.emp_name = data['data']['emp_name'];
          this.emp_doj = data['data']['emp_doj'];
          this.pf_data = data['data']['pf_details'];

          if (this.pf_data.length > 0)
            this.loading_msg = 'Loaded'
          else
            this.loading_msg = 'No Records Found';

            this.appCommon.dismissLoader();
        }, (err:any) => {
          this.appCommon.presentAlert('Server Problem')
          this.appCommon.dismissLoader();
        }
      )
  }
}
