import { Injectable } from '@angular/core'; 
import {ToastController, AlertController, LoadingController, Platform, ModalController } from '@ionic/angular'; 
import { tap } from 'rxjs'; 
import { PhotoViewerPage } from './pages/photo-viewer/photo-viewer.page';
import { HttpserviceService } from './services/httpservice.service'; 
import { Browser } from '@capacitor/browser';

@Injectable()
export class AppCommon {
 
  loginData: any;
  isLoading = false;
  loaderToShow: any;

  // readonly baseAppUrl: string = 'https://cbs.ecandor.com/app.php?a=';
  // readonly baseUrl: string = 'https://cbs.ecandor.com/';  

  constructor(private alertCtrl: AlertController, 
    public loadingController: LoadingController,
    // private file: File, 
    private platform: Platform,
    public toastController: ToastController, 
    public modalController: ModalController,
    public http: HttpserviceService,
    // public http: HttpClient,
  ) {

    let localStoragedata = localStorage.getItem('loginData');
    if(localStoragedata != null)
    {
      this.loginData = JSON.parse(localStorage.getItem('loginData') || '');
    }
    
 
  }

  async presentNoInternetToast(message: string) {
    const toast = await this.toastController.create({
        message: message,
        color: 'danger',
        duration: 2000
    });
    toast.present();
}

async presentAlert(Msg:any) {
    const alert = await this.alertCtrl.create({
        header: 'Alert',
        message: Msg,
        buttons: ['OK']
    });

    await alert.present();
}

async presentLoader(Msg: string) {
    this.isLoading = true;
    this.loaderToShow = this.loadingController.create({
        message: Msg,
        duration: 3000,
    }).then((res) => {
        res.present().then(() => {
            if (!this.isLoading) {
                res.dismiss().then(() => console.log('abort presenting'));
            }
        });
        res.onDidDismiss().then((dis) => {
            console.log('Loading dismissed!');
        });
    });
}

dismissLoader() {
    this.loadingController.dismiss();
}

async presentToast(message: string) {
    const toast = await this.toastController.create({
        message: message,
        duration: 5000,
        cssClass: 'custom-toast',
        icon: 'alert-outline',
        buttons: [
          {
            text: 'Dismiss',
            role: 'cancel'
          }
        ],
      });
    toast.present();
  }
  async presentSuccessToast(message: string) {
    const toast = await this.toastController.create({
        message: message,
        duration: 5000,
        cssClass: 'custom-success-toast',
        icon: 'checkmark-circle-outline',
        buttons: [
          {
            text: 'Dismiss',
            role: 'cancel'
          }
        ],
      });
    toast.present();
  }

  async Empty(mixed_var: any) {
    var key ;    
    if (mixed_var === "" || mixed_var === 'undefined'||
     
        mixed_var === "0" ||
        mixed_var === null ||     
        typeof mixed_var === 'undefined'
    )
    {
        return true;
    } 
    if (typeof mixed_var == 'object') {
        for (key in mixed_var) {
            return false;
        }        return true;
    }
  
    return false;
  }

  public async OpenNativeFileDownload(a:any) {
    let fileUrl: string = a;
    // const fileTransfer: FileTransferObject = this.transfer.create();
    let fileurl = fileUrl.replace("'\'", "'/'")
    let url = fileurl;
    // let filename: any = fileUrl.split('/').pop().split('#')[0].split('?')[0];

    // fileTransfer.download(url, this.file.dataDirectory + filename).then((entry) => {
    //   if (this.platform.is('android') == false) {

    //     let urlFile = String(entry);
    //     let array = urlFile.split("file://");
    //   }
    //   else {
    //     this.fileOpener.open(entry.toURL(), 'application/*')
    //       .then(() =>
    //         console.log('opened' + JSON.stringify(entry.toURL()))
    //       )
    //       .catch(e =>
    //         this.presentAlert('Error opening file' + JSON.stringify(e))
    //       );
    //   }
    // }, (error) => {

    // });
    await Browser.open({ url: url });

  }

  public async imageviewer(path: any){
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

  triggerNotification(module, path, client_db, login_int_code) {

    let url = 'appTriggerNotification&module=' + module + '&client_db=' + client_db;
    url += '&login_int_code=' + login_int_code + '&path=' + path;

    this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)

        console.log(data);

      }, (err) => {
        console.log(err);
      }
    )
  }

  triggerApprovalNotification(module, client_db, emp_int_code, approved_status) {

    let url = 'appTriggerApprovalNotification&module=' + module + '&client_db=' + client_db;
    url += '&emp_int_code=' + emp_int_code + '&approved_status=' + approved_status;

    this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)

        console.log(data);

      }, (err) => {
        console.log(err);
      }
    )
  }

}



//fileupload [help/personal-details]
//it-declaration save [turned off strict in tsconfig]
//leave-cancel-approvals approve btn click