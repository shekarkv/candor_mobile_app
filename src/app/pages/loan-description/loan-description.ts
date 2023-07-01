import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, NavParams, LoadingController } from '@ionic/angular';
import { AppCommon } from 'src/app/app.common';
import { HttpserviceService } from 'src/app/services/httpservice.service';

// @IonicPage()
@Component({
  selector: 'page-loan-description',
  templateUrl: 'loan-description.html',
  styleUrls: ['loan-description.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ]
})
export class LoanDescriptionPage {
  loading_msg: string;
  loginData: any;
  id: any;
  loan_des: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpserviceService,
    public loadingCtrl: LoadingController, public appCommon: AppCommon) {

    this.loading_msg = 'Loading...';
    this.loginData = JSON.parse(localStorage.getItem('loginData'));

    this.id = navParams.get('id');
    this.getLoanDescription();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoanDescriptionPage');
  }

  getLoanDescription() {
    this.appCommon.presentLoader('Please Wait...');
    let url = 'appGetLoanDescription&login_client_db=' + this.loginData['login_client_db'] + '&login_int_code=' + this.loginData['login_int_code'];
    url += '&loan_int_code=' + this.id['loan_master_int_code'] + '&emp_loan_int_code=' + this.id['emp_loan_internal_code'];

      this.http.postservice(url, '').subscribe((res:any)=>{
        let data = JSON.parse(res.data)
            this.loan_des = data.data;
  
            if (this.loan_des.length > 0)
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

}
