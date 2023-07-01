import { Component } from '@angular/core';
import { NavController, Platform, ToastController, LoadingController, ModalController } from '@ionic/angular';
// import { FileChooser } from '@ionic-native/file-chooser';
// import { IOSFilePicker } from '@ionic-native/file-picker';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
// import { GetService } from '../../app/app.getservice';
import { HttpserviceService } from '../../services/httpservice.service'; 
// import { UrlService } from '../../app/app.service';
// import { FilePath } from '@ionic-native/file-path';
// import { Camera } from '@ionic-native/camera';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
// import { File } from '@ionic-native/file';
import { Filesystem, Directory, Encoding, FilesystemDirectory } from '@capacitor/filesystem';
import { PhotoViewerPage } from '../photo-viewer/photo-viewer.page';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { AppCommon } from '../../app.common';
import { IonicModule } from '@ionic/angular'; 
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'; 

declare var cordova: any;
// @IonicPage()
@Component({
  selector: 'page-add-reimbursement-data',
  templateUrl: 'add-reimbursement-data.html',
  styleUrls: ['add-reimbursement-data.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ]
})
export class AddReimbursementDataPage {
  att_prev: string;
  url: String;
  view_file_name: string;
  attachmentFiles: string = '';
  lastImage: string;
  loginData: any;
  bill_date: string;
  bill_no: string;
  targetPath: string;
  filename: string;
  bill_amt: any;
  year_month: any;
  remarks: any;
  status: any;
  fin_int_code: any;
  comp_int_code: any;
  login_type: any;
  year: any;
  month: any;

  constructor(public navCtrl: NavController, 
    // public navParams: NavParams, 
    // public viewCtrl: ViewController,
    private platform: Platform,
    // private fileChooser: FileChooser, private transfer: FileTransfer, 
    public appCommon: AppCommon,
    // private filePicker: IOSFilePicker, private logins: UrlService, public get: GetService, private camera: Camera,
    // private filePath: FilePath, 
    private file: File, private toastCtrl: ToastController, public loadingCtrl: LoadingController,
    public http: HttpserviceService,
    private modalController: ModalController,
    private route: ActivatedRoute) {

    this.loginData = JSON.parse(localStorage.getItem('loginData'));
    this.login_type = this.loginData['login_type'];
    // this.logins.getUrl().subscribe(val => this.url = val);
    this.att_prev = '';
    // this.year_month = navParams.get('year_month');
    // this.year = navParams.get('year');
    // this.month = navParams.get('month');
    // this.fin_int_code = navParams.get('fin_int_code');
    // this.comp_int_code = navParams.get('comp_int_code');
    this.year_month = this.route.snapshot.queryParams['year_month']; 
    this.year = this.route.snapshot.queryParams['year']; 
    this.month = this.route.snapshot.queryParams['month']; 
    this.fin_int_code = this.route.snapshot.queryParams['fin_int_code']; 
    this.comp_int_code = this.route.snapshot.queryParams['comp_int_code']; 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddReimbursementDataPage');
  }

  async cancel() {
    // this.viewCtrl.dismiss();
    await this.modalController.dismiss();
  }

  async Submit() {
    this.appCommon.presentLoader('Please Wait...')

    if (this.bill_date == '' || this.bill_date == 'undefined' || this.bill_date == undefined) {
      this.appCommon.presentAlert('Please enter Bill date');
      this.appCommon.dismissLoader();
      return false;
    }

    if (this.bill_no == '' || this.bill_no == 'undefined' || this.bill_no == undefined) {
      this.appCommon.presentAlert('Please enter Bill Number');
      this.appCommon.dismissLoader();
      return false;
    }

    if (this.attachmentFiles == '' || this.attachmentFiles == undefined) {
      this.appCommon.dismissLoader();
      this.appCommon.presentAlert("Please choose a document to upload");
      return false;
    }
    else {
      let url = this.url + 'appSubmitReimbursementData';

      //File for Upload
      this.targetPath = this.attachmentFiles;

      // File name only
      this.filename = this.lastImage;

      if (this.filename == '') {
        let data = this.attachmentFiles.split('/');
        let count = data.length;
        this.filename = data[count - 1];
      }

      // let param = {
      //   login_int_code: this.loginData['login_int_code'],
      //   login_client_db: this.loginData['login_client_db'],
      //   year_month: this.year_month,
      //   bill_date: this.bill_date,
      //   bill_no: this.bill_no,
      //   bill_amt: this.bill_amt,
      //   remarks: this.remarks,
      //   year: this.year,
      //   month: this.month,
      //   status: this.status,
      //   login_type: this.login_type,
      //   fin_int_code: this.fin_int_code,
      //   comp_int_code: this.comp_int_code,
      //   actual_file_name: encodeURIComponent(this.view_file_name)
      // }

      // let options = {
      //   fileKey: 'fileToUpload',
      //   fileName: this.filename,
      //   chunkedMode: false,
      //   mimeType: 'multipart/form-data',
      //   params: param
      // }

      const base64Data = await this.readAsBase64(this.filename);

      const response = await fetch(base64Data);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('fileToUpload',blob, 'test');
      formData.append('login_int_code', this.loginData['login_int_code']); 
      formData.append('login_client_db', this.loginData['login_client_db']); 
      formData.append('year_month', this.year_month);  
      formData.append('bill_date', this.bill_date);  
      formData.append('bill_no', this.bill_no);  
      formData.append('bill_amt', this.bill_amt);  
      formData.append('remarks', this.remarks);  
      formData.append('year', this.year);  
      formData.append('month', this.month);  
      formData.append('status', this.status);  
      formData.append('login_type', this.login_type);  
      formData.append('fin_int_code', this.fin_int_code);  
      formData.append('comp_int_code', this.comp_int_code);  
      formData.append('actual_file_name',  encodeURIComponent(this.view_file_name));  

      const headers = { 'content-type': 'multipart/form-data' };    

      this.http.postserviceWithHeader(url, formData, headers).subscribe((res:any)=>{
          this.appCommon.presentAlert("Proofs Uploaded Successfully");
          // this.viewCtrl.dismiss(); 
          this.appCommon.dismissLoader();
          
      }, (err:any) => { 
        this.appCommon.dismissLoader();
          alert("Error");
      })
      // const fileTransfer: FileTransferObject = this.transfer.create();

      // fileTransfer.upload(this.targetPath, encodeURI(url), options)
      //   .then(data => {

      //     this.appCommon.presentAlert("Proofs Uploaded Successfully");

      //     this.viewCtrl.dismiss();

      //     this.appCommon.dismissLoader();
      //   }, err => {
      //     this.appCommon.dismissLoader();
      //     this.appCommon.presentAlert("Failed to Upload");
      //   });
      return true;
    }
  }

  private async readAsBase64(photo: any) {
    if (this.platform.is('hybrid')) {
        const file = await Filesystem.readFile({
            path: photo.path
        });

        return file.data;
    }
    else {
        // Fetch the photo, read as a blob, then convert to base64 format
        const response = await fetch(photo.webPath);
        const blob = await response.blob();

        return await this.convertBlobToBase64(blob) as string;
    }
  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
});

  //attachments
  galleryFunc() {
    this.view_file_name = '';
    this.att_prev = '';
    this.attachmentFiles = '';
    // this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
    this.takePicture();
  }

  // cameraFunc() {
  //   this.view_file_name = '';
  //   this.att_prev = '';
  //   this.attachmentFiles = '';
  //   this.takePicture(this.camera.PictureSourceType.CAMERA);
  // }

  // fileFunc() {
  //   this.attachmentFiles = '';
  //   this.view_file_name = '';
  //   this.att_prev = '';
  //   this.att_prev = this.attachmentFiles;

  //   if (this.platform.is('ios')) {
  //     this.iOSFilePicker();
  //   }
  //   else {
  //     this.androidFilePicker();
  //   }
  // }

  // iOSFilePicker() {

  //   this.filePicker.pickFile()
  //     .then((data) => {

  //       this.attachmentFiles = data;

  //       var currentName = data.substr(data.lastIndexOf('/') + 1);
  //       var correctPath = data.substr(0, data.lastIndexOf('/') + 1);

  //       this.lastImage = currentName;
  //       this.view_file_name = currentName;
  //     })
  //     .catch(err => this.appCommon.presentAlert('Failed to open file'));

  // }

  // androidFilePicker() {
  //   this.fileChooser.open()
  //     .then(data => {
  //       this.attachmentFiles = data;
  //       var currentName = data.substr(data.lastIndexOf('/') + 1);
  //       var correctPath = data.substr(0, data.lastIndexOf('/') + 1);
  //       this.lastImage = currentName;
  //       this.file.resolveLocalFilesystemUrl(data)
  //         .then((files) => {
  //           this.view_file_name = files['name'];
  //         }).catch((err) => {
  //         });
  //     })
  //     .catch(err => alert('Error'));
  // }

  checkPlatformForWeb() {
    if(Capacitor.getPlatform() == 'web' || Capacitor.getPlatform() == 'ios') return true;
    return false;
  }

  async takePicture() {

    const image = await Camera.getPhoto({
      quality: 100, 
      source: CameraSource.Prompt,
      resultType:  this.checkPlatformForWeb() ? CameraResultType.DataUrl : CameraResultType.Uri,
      correctOrientation: true,
      allowEditing: true,
    }); 
    console.log('uploadProPic');
    let selectedImage = image;

    if(this.checkPlatformForWeb()) 
      selectedImage.webPath = image.dataUrl;  

    let newImage = selectedImage.webPath || '';
    let currentName = newImage.substring(newImage.lastIndexOf('/') + 1, newImage.lastIndexOf('?'));

    this.att_prev = newImage;

    // let options = {
    //   quality: 40,
    //   sourceType: a,
    //   saveToPhotoAlbum: false,
    //   correctOrientation: true,
    //   allowEdit: true,
    //   mediaType: this.camera.MediaType.PICTURE
    // };

    // this.camera.getPicture(options)
    //   .then((data) => {

    //     if (this.platform.is('android') && a === this.camera.PictureSourceType.PHOTOLIBRARY) {
    //       this.filePath.resolveNativePath(data)
    //         .then(filePath => {
    //           let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
    //           let currentName = data.substring(data.lastIndexOf('/') + 1, data.lastIndexOf('?'));
    //           this.copyFileToLocalDir(correctPath, currentName, currentName);
    //         });
    //     }
    //     else {
    //       var currentName = data.substr(data.lastIndexOf('/') + 1);
    //       var correctPath = data.substr(0, data.lastIndexOf('/') + 1);
    //       this.copyFileToLocalDir(correctPath, currentName, currentName);
    //     }
    //   }, (error) => {
    //     this.appCommon.presentAlert('Failed to load image')
    //   }
    //   )
  }

  // private copyFileToLocalDir(namePath, currentName, newFileName) {
  //   this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
  //     this.lastImage = newFileName;
  //     this.attachmentFiles = this.pathForImage(newFileName);
  //     let array = this.attachmentFiles.split("file://");
  //     this.att_prev = array[1];
  //   }, error => {
  //     this.presentToast('Error while processing file');
  //   });
  // }

  // presentToast(msg) {
  //   let toast = this.toastCtrl.create({
  //     message: msg,
  //     duration: 3000,
  //     position: 'top'
  //   });
  //   toast.present();
  // }

  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

}
