import { Component } from '@angular/core';
import { AlertController, IonicModule, LoadingController, ModalController, NavController, NavParams, Platform } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { AppCommon } from 'src/app/app.common';
import { HttpserviceService } from 'src/app/services/httpservice.service';
import { PhotoViewerPage } from '../photo-viewer/photo-viewer.page';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'page-view-reimbursement-data',
  templateUrl: 'view-reimbursement-data.html',
  styleUrls: ['view-reimbursement-data.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ]
})
export class ViewReimbursementDataPage {
  id: any;
  loginData: any;
  reim_arr: any;
  year: any;
  month: any;
  comp_int_code: any;
  comp_name: any;
  fin_int_code: any;
  year_month: string;
  login_type: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
    public http: HttpserviceService,public common: AppCommon, private platform: Platform, public alertCtrl: AlertController, 
    public modalController: ModalController, public appCommon: AppCommon) {

    this.loginData = JSON.parse(localStorage.getItem('loginData'));
    this.login_type = this.loginData['login_type'];
    this.id = navParams.get('id');
    this.year = navParams.get('year');
    this.month = navParams.get('month');
    this.comp_int_code = this.id['comp_int_code'];
    this.comp_name = this.id['component'];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewReimbursementDataPage');
  }

  ionViewDidEnter() {
    this.getReimbursementData();
  }

  getReimbursementData() {
    this.appCommon.presentLoader('Please Wait...');
    this.year_month = String(this.year).concat(String(this.month));

    let url = 'appGetReimbursementData&login_client_db=' + this.loginData['login_client_db'];
    url += '&login_int_code=' + this.loginData['login_int_code'] + '&year_month=' + this.year_month;
    url += '&comp_int_code=' + this.comp_int_code + '&comp_name=' + this.comp_name + '&login_type=' + this.login_type;

     this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)
          this.reim_arr = data.data;
          this.appCommon.dismissLoader();
         

        }, (err:any) => {
          this.appCommon.presentAlert('Server Problem')
          this.appCommon.dismissLoader();
        }
      )
  }

  // ShowAttachedImage(path) {

  //   if (this.platform.is('android') == false) {
  //     this.browserTab.isAvailable()
  //       .then(isAvailable => {
  //         if (isAvailable) {
  //           this.browserTab.openUrl(path);
  //         } else {
  //         }
  //       });
  //   }
  //   else {
  //     this.photoViewer.show(path, '', { share: false });
  //   }
  // }

  public async ShowAttachedImage(path: any){
    const modal = await this.modalController.create({
      component: PhotoViewerPage,
      componentProps: { 
        selectedImage: path
      },
      cssClass:'modalcss'
    });
    modal.onDidDismiss().then((dataReturned) => {    
    });
    return await modal.present();
  }

  downloadAttachment(file_url) {

    // if (this.platform.is('android') == false) {
    //   this.browserTab.isAvailable()
    //     .then(isAvailable => {
    //       if (isAvailable) {
    //         this.browserTab.openUrl(file_url);
    //       } else {
    //       }
    //     });
    // }
    // else {
      this.common.OpenNativeFileDownload(file_url)
    // }
  }

  

  deleteRow(int_code) {

    const alert = this.alertCtrl.create({ 
      header: 'Confirm delete',
      message: 'Do you want to delete this attachment?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Yes clicked');
            this.appCommon.presentLoader('Please Wait...');
            let url = 'appDeleteReimbursementData&row_int_code=' + int_code['internal_code'];
            url += '&comp_int_code=' + int_code['ref_component_code'] + '&login_client_db=' + this.loginData['login_client_db'];

            this.http.postservice(url, '').subscribe((res:any)=>{
              let data = JSON.parse(res.data)
                  this.appCommon.dismissLoader();
        
                }, (err:any) => {
                  this.appCommon.presentAlert('Server Problem')
                  this.appCommon.dismissLoader();
                }
              )
          }
        }
      ]
    });
  }

  add() {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          year_month: this.year_month,
          comp_int_code: this.comp_int_code,
          year: this.year,
          month: this.month
        }
      };

      this.navCtrl.navigateForward('menu/AddReimbursementDataPage',  navigationExtras );
  }
}
