import { Component } from '@angular/core';
import { AlertController, IonicModule, LoadingController, ModalController, NavController, NavParams, Platform, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; 
import { AppCommon } from 'src/app/app.common';
import { CommonModule } from '@angular/common';
import { PhotoViewerPage } from '../photo-viewer/photo-viewer.page';
import { HttpserviceService } from 'src/app/services/httpservice.service';

@Component({
  selector: 'page-view-attachment',
  templateUrl: 'view-attachment.html',
  styleUrls: ['view-attachment.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ]
})
export class ViewAttachmentPage {
  attachments: any = [];
  head: any;
  amount: any;
  loginData: any;
  login_int_code: any;
  login_client_db: any;
  fin_int_code: any;
  attch_row_id: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalController: ModalController,
    public loadingCtrl: LoadingController,  public appCommon: AppCommon, public alertCtrl: AlertController, 
    public toastController: ToastController,   public platform: Platform,public http: HttpserviceService) {

    this.loginData = JSON.parse(localStorage.getItem('loginData'));
    this.login_client_db = this.loginData['login_client_db'];
    this.login_int_code = this.loginData['login_int_code'];

    this.attachments = navParams.get('attachments');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewAttachmentPage');
  }

  async dismissView() {
    // this.alertCtrl.dismiss();
    await this.modalController.dismiss();
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
      // this.browserTab.isAvailable()
      //   .then(isAvailable => {
      //     if (isAvailable) {
      //       this.browserTab.openUrl(file_url);
      //     } else {
      //     }
      //   });
    // }
    // else {
      this.appCommon.OpenNativeFileDownload(file_url)
    // }
  }

  async delete(attch_row_id) {
    let alert = this.alertCtrl.create({
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

            let url = 'appDeleteAttachment&login_client_db=' + this.login_client_db + '&attch_row_id=' + attch_row_id;

              this.http.postservice(url, '').subscribe((res:any)=>{
                let data = JSON.parse(res.data)
                    this.appCommon.dismissLoader();
                    this.dismissView();
                  }, (err:any) => {
                    this.appCommon.presentAlert('Server Problem')
                    this.appCommon.dismissLoader();
                  }
                )
          }
        }
      ]
    });
    await (await alert).present();
  }
}
