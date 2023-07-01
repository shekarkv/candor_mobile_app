import { Component } from '@angular/core';
import { IonicModule, NavController, AlertController, LoadingController, Platform } from '@ionic/angular';
// import { GetService } from '../../app/app.getservice';
// import { DatePipe } from '@angular/common';
// import { BrowserTab } from '@ionic-native/browser-tab';
import { AppCommon } from '../../app.common';
import { HttpserviceService } from '../../services/httpservice.service'; 
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

// @IonicPage()
@Component({
  selector: 'page-it-computation',
  templateUrl: 'it-computation.html',
  styleUrls: ['it-computation.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ],
})
export class ItComputationPage {
  loginData: any;
  login_client_db: any;
  login_int_code: any;
  today: any;
  component_name: any;
  amount: any;
  it_flag: any;
  current_year: any;
  processed_month: any;
  pdf_url: any;
  it_year_List: any;
  fin_year: any;
  it_details: any;
  url: any;
  yearList: any;
  loading_msg: any;
  login_type: any;

  constructor(public navCtrl: NavController,  
    // public get: GetService, 
    public alertCtrl: AlertController, public loadingCtrl: LoadingController,
    private platform: Platform, 
    public http: HttpserviceService,
    // private browserTab: BrowserTab, 
    public appCommon: AppCommon) {

    this.loading_msg = 'Loading...';

    this.loginData = JSON.parse(localStorage.getItem('loginData') || '');
    this.login_client_db = this.loginData['login_client_db'];
    this.login_int_code = this.loginData['login_int_code'];
    this.login_type = this.loginData['login_type'];

    this.getAllFinancialYear();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ItComputationPage');
  }

  getAllFinancialYear() {
    this.appCommon.presentLoader('Please Wait...');
    let url = 'appGetAllFinancialYear&login_client_db=' + this.login_client_db;
    this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)
        console.log(data)
        this.yearList = data.data['fin_year_list'];
        this.fin_year = data['data']['cur_fin_year_code'];
        this.appCommon.dismissLoader();
        this.getEmpITComputation();

      }, (err:any) => {
        this.appCommon.presentAlert('Server Problem')
        this.appCommon.dismissLoader();
      }
      )
  }

  getEmpITComputation() {
    this.appCommon.presentLoader('Please Wait...');
    let url = 'appGetEmpITComputation&login_client_db=' + this.login_client_db + '&login_int_code=' + this.login_int_code;
    url += '&year_int_code=' + this.fin_year;

    this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)
        this.it_details = data['data']['it_details'];
        this.it_flag = data['data']['it_flag'];

        if (this.it_flag > 0)
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

  downloadEmpItComputation(month:any, year:any) {

    this.appCommon.presentLoader('Please Wait...');

    this.pdf_url = '';

    let url = 'appDownloadItComputation&client_db=' + this.login_client_db + '&month=' + month + '&year=' + year;
    url += '&type=OnlineItaxComputation&login_int_code=' + this.login_int_code + '&emp=' + this.login_int_code;

    this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)
        this.pdf_url = '';
        this.pdf_url = data.data;

        this.OpenPdfOpener(this.pdf_url);
        this.appCommon.dismissLoader();
      }, (err:any) => {
        this.appCommon.presentAlert('Server Problem');
        this.appCommon.dismissLoader();
      }
      )
  }

  OpenPdfOpener(url:any) {
    // if (this.platform.is('android') == false) {
    //   this.browserTab.isAvailable()
    //     .then(isAvailable => {
    //       if (isAvailable) {
    //         this.browserTab.openUrl(url);
    //       } else {
    //       }
    //     });
    // }
    // else {
      this.appCommon.OpenNativeFileDownload(url)
    // }
  }

}
