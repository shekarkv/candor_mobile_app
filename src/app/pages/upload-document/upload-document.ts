import { Component } from '@angular/core';
import {  NavController, NavParams,  Platform, ToastController, LoadingController, AlertController, ModalController } from '@ionic/angular';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { HttpserviceService } from '../../services/httpservice.service'; 
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding, FilesystemDirectory } from '@capacitor/filesystem';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
// import { FileOpener } from '@ionic-native/file-opener/ngx';
import { IonicModule } from '@ionic/angular'; 
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { AppCommon } from '../../app.common';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { File } from '@ionic-native/file/ngx';

declare var cordova: any;
 
@Component({
  selector: 'app-upload-document',
  templateUrl: 'upload-document.html',
  styleUrls: ['upload-document.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule],
  providers: [NavParams, FileTransferObject,FileTransfer,File]
})

export class UploadDocumentPage {
  attachmentFiles: string;
  view_file_name: string;
  att_prev: string;
  lastImage: string;
  login_int_code: any;
  login_client_db: any;
  fin_int_code: any;
  head_int_code: any;
  it_head: any;
  targetPath: string;
  filename: string;
  url: String;
  login_company: any;
  amount: any;
  notes: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private platform: Platform, 
    // private fileOpener: FileOpener, 
    private transfer: FileTransfer, public http: HttpserviceService,
    private file: File, private toastCtrl: ToastController, private modalController: ModalController,
    public loadingCtrl: LoadingController, public alertCtrl: AlertController, public appCommon: AppCommon) {

    this.login_int_code = navParams.get('login_int_code');
    this.login_client_db = navParams.get('login_client_db');
    this.fin_int_code = navParams.get('fin_int_code');
    this.head_int_code = navParams.get('head_int_code');
    this.it_head = navParams.get('it_head');

    // this.logins.getUrl().subscribe(val => this.url = val);
    this.att_prev = '';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UploadDocumentPage');
  }

  async submitItDeclartionProofs() {

    // this.appCommon.presentLoader('Please Wait...')

    if (this.amount == '' || this.amount == 'undefined' || this.amount == undefined) {
      this.appCommon.presentAlert('Please enter amount');
      this.appCommon.dismissLoader();
      return false;
    }

    if (this.notes == '' || this.notes == 'undefined' || this.notes == undefined) {
      this.appCommon.presentAlert('Notes field is mandatory');
      this.appCommon.dismissLoader();
      return false;
    }

    if (this.attachmentFiles == '' || this.attachmentFiles == undefined) {
      this.appCommon.dismissLoader();
      this.appCommon.presentAlert("Please choose a document to upload");
      return false;
    }
    else {
      let url = "appSubmitItDeclartionProofsNew";

      this.targetPath = this.attachmentFiles;
      this.filename = this.lastImage;

      const base64Data = await this.readAsBase64(this.attachmentFiles);

      let param = {
        login_int_code: this.login_int_code,
        login_client_db: this.login_client_db,
        fin_int_code: this.fin_int_code,
        head_int_code: this.head_int_code,
        it_head: this.it_head,
        amount: this.amount,
        notes: this.notes,
        "fileToUpload": this.filename,
        "attachment": base64Data,
        "file_name": this.filename,
        // actual_file_name: encodeURIComponent(this.view_file_name)
      }

      this.http.postservice(url, param).subscribe((res:any)=>{
        console.log(' submitItDeclartionProofs post');
                  //  this.appCommon.dismissLoader();
          let data = JSON.parse(res.data)
          console.log(data.data);
          this.appCommon.presentAlert("Proofs uploaded successfully");

          this.attachmentFiles = '';
          this.att_prev = '';
          this.filename = '';
          this.lastImage = '';
          this.amount = '';
          this.notes = '';


      }, (err:any) => {

        // this.appCommon.dismissLoader(); 
          this.appCommon.presentAlert("Failed to Upload - "+JSON.stringify(err));
      }
    )

    }
    return true
  }

  async dismissView() {
    // this.viewCtrl.dismiss();
    await this.modalController.dismiss();
  }

  async cancel() {
    // this.viewCtrl.dismiss();
    await this.modalController.dismiss();
  }

  cameraFunc() {
    this.view_file_name = '';
    this.att_prev = '';
    this.attachmentFiles = '';
    this.takePicture("camera");
  }

  async fileFunc() {
    this.attachmentFiles = '';
    this.view_file_name = '';
    this.att_prev = '';
    this.att_prev = this.attachmentFiles;

    const result = await FilePicker.pickFiles();
    const file = result.files[0];

    this.view_file_name = file.name;
    this.lastImage = file.name;
    this.attachmentFiles = file.path;

    console.log("this.attachmentFiles - "+this.attachmentFiles);
    console.log("this.lastImage - "+this.lastImage); 
    
  }
  
  async takePicture(a) {
      const image = await Camera.getPhoto({
        quality: 100, 
        source: CameraSource.Prompt,
        resultType:  this.checkPlatformForWeb() ? CameraResultType.DataUrl : CameraResultType.Uri,
        correctOrientation: true,
        allowEditing: false,
      }); 
      console.log('uploadProPic');
      let selectedImage = image;

      
  
      if(this.checkPlatformForWeb()) 
        selectedImage.webPath = image.dataUrl;  
  
      let newImage = selectedImage.webPath || '';
      // let pathwithoutcurrentName = newImage.substring(newImage.lastIndexOf('/') + 1, newImage.lastIndexOf('?'));
      let currentName = newImage.substring(newImage.lastIndexOf('/') + 1);
   
      // this.copyFileToLocalDir(selectedImage.webPath, currentName, this.createFileName()); 
      this.copyFileToLocalDir(selectedImage, currentName,  this.createFileName(), selectedImage.webPath); 
  
  }

  checkPlatformForWeb() {
    if(Capacitor.getPlatform() == 'web' || Capacitor.getPlatform() == 'ios') return true;
    return false;
  }
  
  private async copyFileToLocalDir(namePath:any, currentName:any, newFileName:any, fileData:any) {
      this.attachmentFiles = namePath.path;
      // this.att_prev = namePath.base64String;
      var base64image = await this.readAsBase64(this.attachmentFiles);
      this.att_prev = `data:image/jpeg;base64,${base64image}`;
      this.lastImage = currentName;
  }

 

  private async readAsBase64(path: any) {
    if (this.platform.is('hybrid')) {
        const file = await Filesystem.readFile({
            path: path
        });

        return file.data;
    }
    else {
        // Fetch the photo, read as a blob, then convert to base64 format
        const response = await fetch(path);
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

  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }
 
}

