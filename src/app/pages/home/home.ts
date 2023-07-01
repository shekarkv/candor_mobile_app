import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, ModalController, Platform, NavParams } from '@ionic/angular';
// import { GetService } from '../../app/app.getservice';
import { AppCommon } from '../../app.common';
// import { AppVersion } from '@ionic-native/app-version';
import { IonicModule } from '@ionic/angular'; 
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { HttpserviceService } from '../../services/httpservice.service'; 
import { NavigationExtras } from '@angular/router';
import { App } from '@capacitor/app';

// @IonicPage()

@Component({
  selector: 'app-home',
  templateUrl: 'home.html',
  styleUrls: ['home.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule
    // ,HttpClientModule
  ]
})


export class HomePage {
  loginData: any;
  login_name: any;
  login_pic: any;
  login_company: any;
  login_company_logo: any;
  login_client_db: any;
  login_int_code: any;
  login_code: any;
  leave_list: any;

  constructor(
    public navCtrl: NavController, 
    // public navParams: NavParams, 
    // public get: GetService,
    //  private app: AppVersion,
    public alertCtrl: AlertController, 
    public loadingCtrl: LoadingController, 
    public appCommon: AppCommon,
    public http: HttpserviceService,
    public modalCtrl: ModalController
    ) {
  
  }

  ngOnInit() {
    let localStoragedata = localStorage.getItem('loginData');
    if(localStoragedata != null)
    {
      this.loginData = JSON.parse(localStorage.getItem('loginData') || '');
    
      this.login_name = this.loginData['login_name'];
      this.login_code = this.loginData['login_password'];
      this.login_client_db = this.loginData['login_client_db'];
      this.login_int_code = this.loginData['login_int_code'];
      this.login_pic = this.loginData['login_pic'];
      this.login_company = this.loginData['login_company'];
      this.login_company_logo = this.loginData['login_company_logo'];

      
      this.checkActiveUser();
    }
    else
    {
      this.navCtrl.navigateRoot('/login');
    }
  }

  async checkActiveUser(){
    var appInfo = await App.getInfo();
    var version_code =  appInfo.version;
    var build_code =  appInfo.build;
    console.log("version - "+version_code)
    let url = 'appOnloadServerSideCheck&login_int_code=' + this.loginData['login_int_code']+'&login_client_db='+this.loginData['login_client_db']+'&version_code='+version_code+'&build_code='+build_code;
    this.appCommon.presentLoader('Please Wait.....')
    this.http.postservice(url, '').subscribe((res:any)=>{
        this.appCommon.dismissLoader();
        let data = JSON.parse(res.data) 
        console.log(JSON.stringify(data))

        // var status = data.data;
        if(data.error_code == -1)
        {
          this.appCommon.presentAlert(data.data)
          this.navCtrl.navigateRoot('/login');
        } 
        else if(data.error_code == -2)
        {
          this.appCommon.presentAlert(data.data)
          this.navCtrl.navigateRoot('/login');
        }
        else
          this.getEmployeeLeaveBalance();
        
        
      },(err:any) => {
        this.appCommon.presentAlert('Server Problem')
        this.appCommon.dismissLoader();
      }
    );

  }

  getEmployeeLeaveBalance() { 

    var year = new Date().getFullYear();
    var month = String(new Date().getMonth() + 1);
    if (month.length < 2)
      month = '0' + month;

    this.appCommon.presentLoader('Please Wait.....')

    let url = 'appGetEmployeeLeaveBalance&year=' + year + '&login_client_db=' + this.loginData['login_client_db'];
    url += '&month=' + month + '&login_int_code=' + this.loginData['login_int_code'];

    this.http.postservice(url, '').subscribe((res:any)=>{
        this.appCommon.dismissLoader();
        let data = JSON.parse(res.data)  
        this.leave_list = data.data['leave_arr'];
        
        this.appCommon.dismissLoader();
      },(err:any) => {
        this.appCommon.dismissLoader();
        this.appCommon.presentAlert('Server Problem')
        this.appCommon.dismissLoader();
      }
    );
 
  }

  viewLeaveDetails() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        year: new Date().getFullYear()
      }
    };
    
    // this.navCtrl.push('LeaveApplicationStatusPage', { year: new Date().getFullYear() })
    this.navCtrl.navigateForward('leaveApplicationStatus', navigationExtras );
  }
}