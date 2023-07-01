import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, LoadingController, IonicModule} from '@ionic/angular';
// import { Nav, ViewController } from '@ionic/angular';
// import { Events } from 'ionic-angular';
import { AppCommon } from '../../app.common';
// import { IonicModule } from '@ionic/angular'; 
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { HttpserviceService } from '../../services/httpservice.service'; 
import { App } from '@capacitor/app';

export interface PageInterface {
  title: string;
  pageName: string;
  tabComponent?: any;
  index?: number;
  icon: string;
}

@Component({
  selector: 'app-menu',
  templateUrl: 'menu.html',
  styleUrls: ['menu.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ]
})

export class MenuPage {

  public PageInterface: any
  userKey: any;
  showSubmenu: boolean = false;
  rootPage = 'HomePage';

  // @ViewChild(Nav) nav: Nav;
  loginData: any;
  login_name: any;
  login_pic: any;
  login_name_code: any;
  login_user_type: any;
  module_arr: any;
  is_loan: any;
  is_reimbursement: any;
  login_type: any;
  is_it_decl_proofs: any;
  versionName: string = '1.0.13';

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public loadingCtrl: LoadingController,
    // private events: Events, public get: GetService, 
    public appCommon: AppCommon, 
    public http: HttpserviceService
    // public viewCtrl: ViewController
    ) {

     this.setAppVersion() 

    let localStoragedata = localStorage.getItem('loginData');
    if(localStoragedata != null)
    { 
      this.loginData = JSON.parse(localStorage.getItem('loginData') || '');
      this.login_name = this.loginData['login_name'];
      this.login_pic = this.loginData['login_pic'];
      this.login_user_type = this.loginData['login_user_type'];
      this.login_name_code = this.loginData['login_concated_name'];
      this.login_type = this.loginData['login_type'];

      this.module_arr = this.loginData['module_arr'];
      
      this.is_loan = this.module_arr.includes("Loan Statement");
      this.is_reimbursement = this.module_arr.includes("Reimbursement Claim");
      this.is_it_decl_proofs = this.module_arr.includes("IT Savings Declaration Proofs");

      if (this.login_user_type == 'Admin' || this.login_user_type == 'admin') {
        this.PageInterface = [
          { icon: 'laptop', title: 'Holiday Work Permit Approval', pageName: 'HolidayWorkPermitApprovalPage' }
        ];
      }
      else {
        this.PageInterface = [
          { icon: 'cash-sharp', title: 'Monthly Payslip', pageName: 'MonthlyPayslipPage' },
          { icon: 'list-sharp', title: 'YTD Statement', pageName: 'YtdStatementPage' },
          { icon: 'document', title: 'PF YTD Statement', pageName: 'PfYtdStatementPage' },
          { icon: 'calculator', title: 'IT Computation', pageName: 'ItComputationPage' },
          { icon: 'newspaper', title: 'IT Declaration', pageName: 'ItDeclarationsPage' },
        ];
        if (this.is_it_decl_proofs == true) {
          this.PageInterface.push({ icon: 'attach', title: 'IT Declaration Proofs', pageName: 'ItDeclarationProofsPage' })
        }

        if (this.is_loan == true) {
          this.PageInterface.push({ icon: 'list-sharp', title: 'Loan Statement', pageName: 'LoanStatementPage' })
        }

        if (this.is_reimbursement == true) {
          this.PageInterface.push(
            { icon: 'newspaper', title: 'Reimbursement Claims', pageName: 'ReimbursementClaimsPage' }
          )
        }
        if (this.login_type == 'Attendance') {
          this.PageInterface.push(
            { icon: 'calendar', title: 'Attendance', pageName: 'AttendancePage' }
          )
        }
        this.PageInterface.push(
          { icon: 'person-circle', title: 'My Account', pageName: 'MyAccountPage' }
        )
      }

    }
    
    // this.events.subscribe('employeeProfileUpdated', () => {
    //   this.login_pic = localStorage.getItem('employee_login_pic');
    // });
  }

  async setAppVersion(){
    var appInfo = await App.getInfo();
    var version_code =  appInfo.version;
    console.log("version - "+version_code)

    this.versionName = version_code;
  }

  openMyProfilePage() {
    // this.navCtrl.push('PersonalDetailsPage');
    this.navCtrl.navigateRoot('menu/PersonalDetails');
  }

  menuItemHandler(): void {
    this.showSubmenu = !this.showSubmenu;
  }

  openPage(page:any) {
    let params = {};
    if (page.index) {
      params = { tabIndex: page.index };
    }
    // this.nav.push(page.pageName, params);
    this.navCtrl.navigateRoot('menu/'+page.pageName); 
  }

  async logout() {
    const alert = this.alertCtrl.create({ 
      message: 'Are you sure to logout?',

      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Logout',
          handler: () => { 
            this.appCommon.presentLoader('Please Wait...') 

            let url = 'appDeleteLoginToken&login_client_db=' + this.loginData['login_client_db'];
            url += '&login_int_code=' + this.loginData['login_int_code'];

            this.http.postservice(url,'').subscribe
              (
                (data: any) => {
                  console.log(data)
                  this.appCommon.dismissLoader();
                  localStorage.clear(); 
                  this.navCtrl.navigateRoot('/login');  
                }, (err: any) => {
                  this.appCommon.presentAlert('Server Problem, try again later!')
                  this.appCommon.dismissLoader();
                }
              )
          }
        }
      ]
    });
    (await alert).present();
  }
}
