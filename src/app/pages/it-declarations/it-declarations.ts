import { Component } from '@angular/core';
import { IonicModule, NavController, LoadingController, AlertController } from '@ionic/angular';
import { AppCommon } from '../../app.common';
import { HttpserviceService } from '../../services/httpservice.service'; 
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import * as $ from 'jquery';
// import { JsonPipe } from '@angular/common';

// @IonicPage()
@Component({
  selector: 'page-it-declarations',
  templateUrl: 'it-declarations.html',
  styleUrls: ['it-declarations.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ], 
})
export class ItDeclarationsPage {
  loading_msg: string;
  loginData: any;
  login_client_db: any;
  login_int_code: any;
  login_type: any;
  yearList: any;
  fin_year: any;
  shownGroup: any;
  it_data: any;
  view_image: any;
  amount: any;
  isData = 'yes';
  isRegimeSet = 'no';
  login_code: any;

  cur_year:any;
  cur_month:any;
  tax_regime: string = '';
  

  constructor(public navCtrl: NavController,public http: HttpserviceService,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController, public appCommon: AppCommon) {

    this.loading_msg = 'Loading...';

    this.loginData = JSON.parse(localStorage.getItem('loginData') || '');
    this.login_client_db = this.loginData['login_client_db'];
    this.login_int_code = this.loginData['login_int_code'];
    this.login_code = this.loginData['login_code'];
    this.login_type = this.loginData['login_type'];

   
    this.getOnlineMonthYear();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ItDeclarationsPage');
  }

  getOnlineMonthYear(){

    this.appCommon.presentLoader('Please Wait...');

    let url = 'appGetOnlineMonthYear';
    this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)
          console.log(data) 
          this.appCommon.dismissLoader();
          this.cur_month = data.data["current_month"];
          this.cur_year = data.data["current_year"];
          
          this.getAllFinancialYear();

        }, (err:any) => {
          this.appCommon.presentAlert('Server Problem')
          this.appCommon.dismissLoader();;
        }
      )
 
    
  }

  getAllFinancialYear() {
    this.appCommon.presentLoader('Please Wait..');

    let url = 'appGetAllFinancialYear&login_client_db=' + this.login_client_db;
    this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)
          console.log(data)
          this.appCommon.dismissLoader();
          this.yearList = data.data['fin_year_list'];
          this.fin_year = data['data']['cur_fin_year_code'];
          
          // this.getItDeclaration();
          this.getOnlineTaxRegime();

        }, (err:any) => {
          this.appCommon.presentAlert('Server Problem')
          this.appCommon.dismissLoader();;
        }
      )
  }

  async callRegimePrompt(){
    let alert = this.alertCtrl.create({
      header: 'Please select tax regime',
      inputs: [
        {
          name: 'Old',
          type: 'radio',
          label: 'Old',
          value: 'old', 
        },
        {
          name: 'New',
          type: 'radio',
          label: 'New',
          value: 'new', 
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('cancel clicked')
          }
        },
        {
          text: 'Proceed',
          handler: (data) => {
            console.log('data - '+data)
            if(data == 'old')
            {
              this.isData = 'yes';
              this.getItDeclaration();
              this.updateTaxRegimeStatus('Old'); 
            }
            else
            {
              this.isData = 'no';
              this.it_data = '';
              this.updateTaxRegimeStatus('New');
              this.appCommon.presentAlert("Employees who opt for new tax regime need not provide any declarations."); 
            }
 
              return true;
          }
        }
      ]
    });
    (await alert).present();
  }

  updateTaxRegimeStatus(tax_regime){
    this.appCommon.presentLoader('Please Wait...!');

    let url = 'appUpdateTaxRegimeStatus&tax_regime='+tax_regime+'&fin_year='+this.fin_year+'&login_client_db=' + this.login_client_db+'&online_emp_ic_code=' + this.login_int_code;
    this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)
      this.appCommon.dismissLoader(); 
          console.log(data) 
          if(data.error_code == 0)
          { 
            this.appCommon.dismissLoader();;
            this.isRegimeSet = 'yes';
            this.getOnlineTaxRegime();
          }
          else
            this.appCommon.presentAlert(data.data);
          

        }, (err:any) => {
          this.appCommon.presentAlert('Server Problem')
          this.appCommon.dismissLoader();;
        }
      )
 
  }

  getOnlineTaxRegime(){ 

    this.appCommon.presentLoader('Please Wait...!');

    let url = 'appGetOnlineTaxRegime&online_emp_ic_code=' + this.login_int_code+'&emp='+this.login_code+'&fin_year='+this.fin_year+'&login_client_db=' + this.login_client_db;
    this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)
      this.appCommon.dismissLoader();
      this.appCommon.dismissLoader();
          console.log(data) 
          if(data.error_code == 0)
          {
            if(data.data['tax_regime_updated'] == 1)
            {
              this.isRegimeSet = 'yes'  
              if(data.data['tax_regime'] == 'New')
              {
                this.tax_regime = 'New'
                this.isData = 'no';
              }
              if(data.data['tax_regime'] == 'Old')
              {
                this.tax_regime = 'Old'
                this.isData = 'yes';
                this.getItDeclaration();
              }
            }
            else
            {
              this.callRegimePrompt();
            } 
            this.appCommon.dismissLoader();
          }
          else
          {
            this.appCommon.presentAlert(data.data);
            this.appCommon.dismissLoader();
          }
          

        }, (err:any) => {
          this.appCommon.presentAlert('Server Problem')
          this.appCommon.dismissLoader();;
        }
      )
 
  }


  getItDeclaration() {
 
    this.it_data = [];

    this.appCommon.presentLoader('Please Wait...');

    let url = 'appGetItDeclarationData&login_client_db=' + this.login_client_db;
    url += '&year=' + this.fin_year + '&login_int_code=' + this.login_int_code;
    this.http.postservice(url, '').subscribe((res:any)=>{
      this.appCommon.dismissLoader();
      let data = JSON.parse(res.data)
          this.it_data = data['data'];

          if (this.it_data.length > 0)
            this.loading_msg = 'Loaded'
          else
            this.loading_msg = 'No Records Found';

          console.log(data)
          this.appCommon.dismissLoader();;
        }, (err:any) => {
          this.appCommon.presentAlert('Server Problem')
          this.appCommon.dismissLoader();
        }
      )
  }

  toggleGroup(group:any) {
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    } else {
      this.shownGroup = group;
    }
  }

  isGroupShown(group:any) {
    return this.shownGroup === group;
  }
  
  save() {
    var data_cnt = 0;
    
    var item_arr = new Object(); 

    var obj = $("input[id*='it_tax_save_']");

    $.each(obj, function (k , v) {

      item_arr[k] = new Object();  

      var id = v['id'].split("_").pop();

      var amount = $(this).val();
      
      item_arr[k]['id'] = id;
      item_arr[k]['amount'] = amount;

      data_cnt++;

    });

    var rateJSON = JSON.stringify(item_arr);
    
    this.appCommon.presentLoader('Please Wait...');

    let url = 'appSaveItDeclaration&login_int_code=' + this.loginData['login_int_code'] + '&fin_year=' + this.fin_year;
    url += '&output_details=' + rateJSON + '&login_client_db=' + this.login_client_db+"&tax_regime="+this.tax_regime;

    this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)
  
          this.appCommon.presentAlert(data.data);
          this.appCommon.dismissLoader();;
        }, (err:any) => {
          this.appCommon.presentAlert(JSON.stringify(err))
          this.appCommon.dismissLoader();
        }
      )
  }
}
