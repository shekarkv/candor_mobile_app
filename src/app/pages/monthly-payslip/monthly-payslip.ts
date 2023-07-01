import { Component } from '@angular/core';
// import { IonicPage, NavController, NavParams } from '@ionic/angular';
import { IonicModule, Platform, LoadingController, AlertController, NavParams } from '@ionic/angular';
import { DatePipe } from '@angular/common';
// import { GetService } from '../../app/app.getservice';
// import { BrowserTab } from '../../../node_modules/@ionic-native/browser-tab';
import { AppCommon } from '../../app.common';
import { HttpserviceService } from '../../services/httpservice.service'; 
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Browser } from '@capacitor/browser';

// @IonicPage()
@Component({
  selector: 'page-monthly-payslip',
  templateUrl: 'monthly-payslip.html',
  styleUrls: ['monthly-payslip.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ],
  providers: [NavParams, DatePipe,FileTransfer, File]
})
export class MonthlyPayslipPage {

  i=true;
  j=true

  loginData: any;
  login_client_db: any;
  login_int_code: any;
  from_page: string;
  net_pay: any;
  total_deduction: any;
  total_earning: any;
  code: any;
  name: any;
  doj: any;
  department: any;
  designation: any;
  deductions_list: any;
  earnings_list: any;
  today: any;
  fdate: any;
  cur_year: any;
  processed_month: any;
  heading: any;
  login_company: any;

  pdf_url: any;

  //collapsable menu
  shownEarningGroup = null;
  shownDeductionGroup = null;

  earnings_total: number = 0;
  deductions_total: number | undefined;
  final_date: any;
  login_type: any;
  processed_year: string | undefined;
  net_pay_flag: any;

  constructor(
    // public navCtrl: NavController, 
    public navParams: NavParams,
     public datepipe: DatePipe,
    // public get: GetService, 
    public alertCtrl: AlertController, public loadingCtrl: LoadingController,
    private platform: Platform, 
    public http: HttpserviceService,
    // private browserTab: BrowserTab, 
    private transfer: FileTransfer,
    public appCommon: AppCommon,
    private route: ActivatedRoute,
    private file: File,
    private fileOpener: FileOpener) {

    this.loginData = JSON.parse(localStorage.getItem('loginData') || '');
    this.login_client_db = this.loginData['login_client_db'];
    this.login_int_code = this.loginData['login_int_code'];
    this.login_company = this.loginData['login_company'];
    this.login_type = this.loginData['login_type'];

    this.from_page = 'current';
    // this.fdate = navParams.get("date");  //from ytd page
    this.fdate = this.route.snapshot.queryParams['date']; 
    console.log('fdate.... - '+this.fdate);
    console.log('fdate1... - '+navParams.get("date"));
    this.final_date = navParams.get("final_date");  //from home page
    this.from_page = navParams.get("from_page");

    if (this.from_page == "ytd") {
      this.today = this.fdate;
      this.getMonthlyPayslip();
      this.displayHeading();
    }
    else if (this.from_page == "home") {
      this.today = this.final_date;
      this.getMonthlyPayslip();
      this.displayHeading();
    }
    else {
      this.getLastProcessedMonth();
    }
  }

  toggleEarningGroup(group:any) {

    if (this.isEarningGroupShown(group)) {
      this.shownEarningGroup = null;
    } else {
      this.shownEarningGroup = group;
    }
  }

  isEarningGroupShown(group:any) {
    return this.shownEarningGroup === group;
  }

  toggleDeductionGroup(group:any) {

    if (this.isDeductionGroupShown(group)) {
      this.shownDeductionGroup = null;
    } else {
      this.shownDeductionGroup = group;
    }
  }

  isDeductionGroupShown(group:any) {
    return this.shownDeductionGroup === group;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MonthlyPayslipPage');
  }

  getLastProcessedMonth() {
    this.appCommon.presentLoader('Please Wait...');

    let url = 'appGetLastProcessedMonth&login_client_db=' + this.login_client_db + '&login_int_code=' + this.login_int_code;
    
    this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)
          this.processed_month = String(data.data['month']);
          this.processed_year = String(data.data['year']);

          if (this.processed_month.length == 1) {
            this.processed_month = "0" + this.processed_month;
          }
          var temp = String(this.processed_year).concat("-");
          var update_date = temp.concat(String(this.processed_month));
          this.today = update_date;

          this.appCommon.dismissLoader();

          this.displayHeading();
          this.getMonthlyPayslip();

        }, (err:any) => {
          this.appCommon.presentAlert('Server Problem')
          this.appCommon.dismissLoader();
        })
  }

  displayHeading() {
    var month_in_words = this.datepipe.transform(this.today, 'MMMM');
    var new_year = this.datepipe.transform(this.today, 'yyyy');
    var temp = String(month_in_words).concat("-");
    this.heading = temp.concat(String(new_year));
  }

  getMonthlyPayslip() {
    this.appCommon.presentLoader('Please Wait...');
    var year = this.datepipe.transform(this.today, 'yyyy');
    var month = this.datepipe.transform(this.today, 'MM');
    let url = 'appGetMonthlyPayslip&login_int_code=' + this.login_int_code + '&month=' + month + '&year=' + year + '&login_client_db=' + this.login_client_db;

    this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)
          this.code = data['data']['monthly_pay_slip_header']['code'];
          this.name = data['data']['monthly_pay_slip_header']['name'];
          this.doj = data['data']['monthly_pay_slip_header']['date_of_joining'];
          this.designation = data['data']['monthly_pay_slip_header']['designation'];

          this.earnings_list = data['data']['monthly_pay_slip_earnings'];
          this.deductions_list = data['data']['monthly_pay_slip_deductions'];

          this.total_earning = data['data']['monthly_pay_slip_total']['total_earning'];
          this.total_deduction = data['data']['monthly_pay_slip_total']['total_deduction'];

          this.net_pay = data['data']['monthly_pay_slip_total']['net_pay'];
          this.net_pay_flag = data['data']['net_pay_flag'];

          this.getPdfUrl();

          this.appCommon.dismissLoader();
        }, (err:any) => {
          this.appCommon.presentAlert('Server Problem')
          this.appCommon.dismissLoader();
        })
  }

  getPdfUrl() {
    var year = this.datepipe.transform(this.today, 'yyyy');
    var month = this.datepipe.transform(this.today, 'MM');
    let url = 'appDownloadMonthlyPayslipPrint&month=' + month + '&year=' + year + '&client_db=' + this.login_client_db + '&type=OnlineMonthlyPaySlip&online_emp_ic_code=';
    url += this.login_int_code + '&emp=' + this.login_int_code;
    this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)
          this.pdf_url = data.data;
        }, (err:any) => {
          this.appCommon.presentAlert('Server Problem')
        }
      )
  }

  changeEmpData() {
    this.displayHeading();
    this.getMonthlyPayslip();
  }

  async downloadPdf() {
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

    // await Browser.open({ url: this.pdf_url });
    
    // const fileTransfer: FileTransferObject = this.transfer.create();
  
    // fileTransfer.download(this.pdf_url, this.file.externalDataDirectory + 'file.pdf').then((entry) => {
    //   console.log('Download complete: ' + entry.toURL()); 
      
    //   this.fileOpener.open(entry.toURL(), 'application/pdf')
    //     .then(() => console.log('File opened successfully'))
    //     .catch((error) => console.log('Error opening file: ', error));
    // }, (error) => {
    //   console.log('Download error: ', error);
    // });
  }

  toggleSection(i:any) {
    this.earnings_list[i].open = !this.earnings_list[i].open;
  }
}
