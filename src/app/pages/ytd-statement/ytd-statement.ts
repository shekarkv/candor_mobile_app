import { Component } from '@angular/core';
import { NavController,  LoadingController, AlertController, Platform } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { MonthlyPayslipPage } from '../monthly-payslip/monthly-payslip';
// import { GetService } from '../../app/app.getservice';
// import { BrowserTab } from '@ionic-native/browser-tab';
import { AppCommon } from '../../app.common';
import { HttpserviceService } from '../../services/httpservice.service'; 
import { NavigationExtras } from '@angular/router';
import { IonicModule } from '@ionic/angular'; 
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

// @IonicPage()
@Component({
  selector: 'page-ytd-statement',
  templateUrl: 'ytd-statement.html',
  styleUrls: ['ytd-statement.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ],
  providers: [DatePipe]
})
export class YtdStatementPage {
  loginData: any;
  login_client_db: any;
  login_name: any;
  login_password: any;
  login_int_code: any;
  yearList: any;
  fyear: any;
  ytd_list: any;
  formatted_month: any;
  ytd_statement_flag: any;
  login_company: any;
  today: any;
  pdf_url: any;
  loading_msg: any;
  login_type: any;

  constructor(public navCtrl: NavController, 
    // public navParams: NavParams, 
    public datepipe: DatePipe,
    // public get: GetService, 
    public alertCtrl: AlertController, public loadingCtrl: LoadingController,
    private platform: Platform, public http: HttpserviceService,
    // private browserTab: BrowserTab, 
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
    console.log('ionViewDidLoad YtdStatementPage');
  }

  getAllFinancialYear() {
    this.appCommon.presentLoader('Please Wait...');
    let url = 'appGetAllFinancialYear&login_client_db=' + this.login_client_db;
    this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)
          this.yearList = data.data['fin_year_list'];
          this.fyear = data['data']['cur_fin_year_code'];
          this.appCommon.dismissLoader();
          this.getYtdStatement();

        }, (err:any) => {
          this.appCommon.presentAlert('Server Problem')
          this.appCommon.dismissLoader();
        }
      )
  }

  getYtdStatement() {
    this.appCommon.presentLoader('Please Wait...');
    let url = 'appGetYtdStatement&login_client_db=' + this.login_client_db + '&year=' + this.fyear + '&login_int_code=' + this.login_int_code;
    this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)
          this.ytd_list = data['data']['ytd_statement'];
          this.ytd_statement_flag = data['data']['ytd_statement_flag'];

          if (this.ytd_list.length > 0)
            this.loading_msg = 'Loaded'
          else
            this.loading_msg = 'No Records Found';

          this.getPdfUrl();

          this.appCommon.dismissLoader();
        }, (err:any) => {
          this.appCommon.presentAlert('Server Problem')
          this.appCommon.dismissLoader();
        }
      )
  }

  redirectToMonthlyPayslip(month:any, year:any) {
    this.appCommon.presentLoader('Please Wait...');
    let url = 'appRedirectToMonthlyPayslip&month=' + month;
    this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)
          this.formatted_month = data['data']['formatted_month'];
          var temp = year.concat("-");
          var final_date = temp.concat(this.formatted_month);
         
          this.appCommon.dismissLoader();

          // this.navCtrl.push(MonthlyPayslipPage, { date: final_date, from_page: "ytd" });
          
          let navigationExtras: NavigationExtras = {
            queryParams: {
              date: final_date,
              from_page: "ytd"
            }
          };

          this.navCtrl.navigateForward('menu/MonthlyPayslipPage',  navigationExtras );

        }, (err:any) => {
          this.appCommon.presentAlert('Server Problem')
          this.appCommon.dismissLoader();
        }
      )
  }

  getPdfUrl() {
    let url = 'appDownloadYtdStatement&client_db=' + this.login_client_db + '&year_int_code=' + this.fyear + '&type=OnlineYearToDateSalary&online_emp_ic_code=' + this.login_int_code + '&emp=' + this.login_int_code;
    this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)
          this.pdf_url = data.data;
        }, (err:any) => {
          this.appCommon.presentAlert('Server Problem')
        }
      )
  }

  downloadYtd() {
    // if (this.platform.is('android') == false) {
    //   this.browserTab.isAvailable()
    //     .then(isAvailable => {
    //       if (isAvailable) {
    //         this.browserTab.openUrl(this.pdf_url);
    //       } else {
    //       }
    //     });
    // }
    // else {
      this.appCommon.OpenNativeFileDownload(this.pdf_url)
    // }
  }
}
