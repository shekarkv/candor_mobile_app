import { Component } from '@angular/core';
import { NavController,  Platform, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AppCommon } from '../../app.common';
import { IonicModule } from '@ionic/angular'; 
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
// import { GetService } from '../../app/app.getservice';
// import { Camera } from '@ionic-native/camera';
// import { FilePath } from '@ionic-native/file-path';
// import { File } from '@ionic-native/file';
// import { FileChooser } from '@ionic-native/file-chooser';
// import { IOSFilePicker } from '@ionic-native/file-picker';
// import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
// import { UrlService } from '../../app/app.service';
import { HttpserviceService } from '../../services/httpservice.service'; 
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding, FilesystemDirectory } from '@capacitor/filesystem';
import { PhotoViewerPage } from '../photo-viewer/photo-viewer.page';
import { FileOpener } from '@ionic-native/file-opener/ngx'; 


declare var cordova: any;
// @IonicPage()
@Component({
  selector: 'page-help',
  templateUrl: 'help.html',
  styleUrls: ['help.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ]
})
export class HelpPage {

  loginData: any;
  login_client_db: any;
  login_int_code: any;
  login_company: any;
  message: any;
  query: any;
  subject: any;
  login_code: any;
  login_name: any;
  view_file_name: any;
  att_prev: string;
  attachmentFiles: any;
  lastImage: any;
  url: any;
  filename: any;
  targetPath: any;
  imageURI: any;

  constructor(public navCtrl: NavController, public http: HttpserviceService,
    //  public get: GetService, private camera: Camera,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController, private platform: Platform,
    //  private filePath: FilePath,
    public appCommon: AppCommon,  private toastCtrl: ToastController,
    // private fileChooser: FileChooser,
    // private filePicker: IOSFilePicker, private transfer: FileTransfer, private logins: UrlService
    ) {

    this.loginData = JSON.parse(localStorage.getItem('loginData') || '');
    this.login_client_db = this.loginData['login_client_db'];
    this.login_int_code = this.loginData['login_int_code'];
    this.login_company = this.loginData['login_company'];
    this.login_code = this.loginData['login_code'];
    this.login_name = this.loginData['login_name'];

    // this.logins.getUrl().subscribe((val:any) => this.url = val);
    this.att_prev = '';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HelpPage');
  }

  async saveOnlineHelpQuery() {
    
    if (this.subject == '' || this.subject == undefined) {
      this.appCommon.presentAlert("Subject field is mandatory");
      return false;
    }
    if (this.query == '' || this.query == undefined) {
      this.appCommon.presentAlert("Query field is mandatory");
      return false;
    }

    this.appCommon.presentLoader('Please Wait...');

    if (this.attachmentFiles == '' || this.attachmentFiles == undefined && this.subject != '' && this.query != '') {

      let url = 'appSaveOnlineHelpQuery&login_int_code=' + this.login_int_code + '&login_client_db=' + this.login_client_db;
      url += '&query=' + encodeURIComponent(this.query) + '&subject=' + encodeURIComponent(this.subject);
      url += '&login_company=' + this.login_company + '&login_code=' + this.login_code + '&login_name=' + this.login_name;

      // this.get.getservice(url)
      //   .subscribe((data:any) => {
        this.http.getservice(url).subscribe((res:any)=>{
          let data = JSON.parse(res.data)

          this.message = data.data;

          if (this.message == 'mailsuccess') {
            this.appCommon.presentAlert("Thank you for submitting your query.We will revert to you within 48 working hours.");
            this.subject = '';
            this.query = '';
            this.attachmentFiles = '';
            this.filename = '';
            this.att_prev = '';
            this.view_file_name = '';
          }
          else {
            this.appCommon.presentAlert("Failed sending Query. Please try again!!!");
          }
          console.log(data);
          this.appCommon.dismissLoader();
        }, (err:any) => {
          console.log(JSON.stringify(err));
          this.appCommon.dismissLoader();
        }
      )
    } //end-of-if
    else {
      let url = "appSaveHelpQueryWithAttachments";

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
      //   login_int_code: this.login_int_code,
      //   login_client_db: this.login_client_db,
      //   query: encodeURIComponent(this.query),
      //   subject: encodeURIComponent(this.subject),
      //   login_company: this.login_company,
      //   login_code: this.login_code,
      //   login_name: this.login_name,
      //   actual_file_name: encodeURIComponent(this.view_file_name)
      // }
      // let options = {
      //   fileKey: 'fileToUpload',
      //   fileName: this.filename,
      //   chunkedMode: false,
      //   mimeType: 'multipart/form-data',
      //   params: param
      // }
      // const fileTransfer: FileTransferObject = this.transfer.create();
      
      this.appCommon.presentLoader('Please Wait...')

      const base64Data = await this.readAsBase64(this.targetPath);
 

      // const formData = new FormData();
      // formData.append('fileToUpload',blob, 'test');
      // formData.append('login_int_code', this.login_int_code);
      // formData.append('login_client_db', this.login_client_db);
      // formData.append('query', encodeURIComponent(this.query));
      // formData.append('subject', encodeURIComponent(this.subject));
      // formData.append('login_company', this.login_company);
      // formData.append('login_code', this.login_code);
      // formData.append('login_name', this.login_name);
      // formData.append('actual_file_name', encodeURIComponent(this.view_file_name));

      let param = {
        login_int_code: this.login_int_code,
        login_client_db: this.login_client_db,
        query: encodeURIComponent(this.query),
        subject: encodeURIComponent(this.subject),
        login_company: this.login_company,
        login_code: this.login_code,
        login_name: this.login_name,
        "fileToUpload": this.filename,
        "attachment": base64Data,
        "file_name": this.filename,
      }

      const headers = { 'content-type': 'multipart/form-data' };    


      this.http.postserviceWithHeader(url, param, headers).subscribe((res:any)=>{
          this.appCommon.dismissLoader();
          this.appCommon.presentAlert("Thank you for submitting your query.We will revert to you within 48 working hours.");
          this.attachmentFiles = '';
          this.att_prev = '';
          this.filename = '';
          this.lastImage = '';
          this.subject = '';
          this.query = '';

          // this.appCommon.dismissLoader();
      }, (err:any) => { 
        this.appCommon.dismissLoader();
          alert("Error");
      })
      // fileTransfer.upload(this.targetPath, encodeURI(url), options)
      //   .then((data:any) => {

      //     this.appCommon.presentAlert("Thank you for submitting your query.We will revert to you within 48 working hours.");
      //     this.attachmentFiles = '';
      //     this.att_prev = '';
      //     this.filename = '';
      //     this.lastImage = '';
      //     this.subject = '';
      //     this.query = '';

      //     this.appCommon.dismissLoader();
      //   }, (err:any) => {
      //     this.appCommon.dismissLoader();
      //     alert("Error");
      //   });
    }//end-of-else
    return true; 
  }

  private async readAsBase64(photo: any) {
    if (this.platform.is('hybrid')) {
        const file = await Filesystem.readFile({
            path: photo
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

  cancelQuery() {
    this.subject = '';
    this.query = '';
  }

  deleteAttachmentFile() {
    this.attachmentFiles = '';
    this.att_prev = '';
    this.filename = '';
    this.lastImage = '';
  }

  galleryFunc() {
    this.view_file_name = '';
    this.att_prev = '';
    this.attachmentFiles = '';
    // this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
    this.takePicture();
  }

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
  //     .then((data:any) => {
  //       this.attachmentFiles = data;
  //       var currentName = data.substr(data.lastIndexOf('/') + 1);
  //       var correctPath = data.substr(0, data.lastIndexOf('/') + 1);
  //       this.lastImage = currentName;
  //       this.view_file_name = currentName;
  //     })
  //     .catch((err:any) => console.log('Error', err));
  // }

  // androidFilePicker() {
  //   this.fileChooser.open()
  //     .then((data:any) => {
  //       this.attachmentFiles = data;
  //       var currentName = data.substr(data.lastIndexOf('/') + 1);
  //       var correctPath = data.substr(0, data.lastIndexOf('/') + 1);

  //       this.lastImage = currentName;
  //       this.file.resolveLocalFilesystemUrl(data)
  //         .then((files:any) => {
  //           this.view_file_name = files['name'];
  //         }).catch((err:any) => {
  //         });
  //     })
  //     .catch((e:any) => alert('Error'));
  // }

  async takePicture() {

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
    let currentpath = newImage.substring(newImage.lastIndexOf('/') + 1, newImage.lastIndexOf('?'));

    this.att_prev = newImage;
    this.attachmentFiles = image.path;
    this.lastImage = newImage.substring(newImage.lastIndexOf('/') + 1);
    // this.copyFileToLocalDir(selectedImage, currentName, currentName)

    // let options =
    // {
    //   quality: 50,
    //   sourceType: a,
    //   saveToPhotoAlbum: false,
    //   correctOrientation: true,
    //   allowEdit: true,
    //   mediaType: this.camera.MediaType.PICTURE
    // };
    // this.camera.getPicture(options)
    //   .then((data:any) => {
    //     if (this.platform.is('android') && a === this.camera.PictureSourceType.PHOTOLIBRARY) {
    //       this.filePath.resolveNativePath(data)
    //         .then((filePath:any) => {

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
    //   }, (error:any) => {
    //     console.log("error------>" + JSON.stringify(error))
    //   }
    // )
  }

  checkPlatformForWeb() {
    if(Capacitor.getPlatform() == 'web' || Capacitor.getPlatform() == 'ios') return true;
    return false;
  }
  
  // private async copyFileToLocalDir(namePath:any, currentName:any, newFileName:any) {

  //   const savedFile = await Filesystem.copy({
  //      from: currentName,  // directory prop removed, Capacitor parses filename for us
  //      to: "newPhoto.jpg",
  //      toDirectory: FilesystemDirectory.Data
  //  });
   
  //  this.att_prev = savedFile.uri;
    // this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then((success:any) => {
    //   this.lastImage = newFileName;
    //   this.attachmentFiles = this.pathForImage(newFileName);
    //   let array = this.attachmentFiles.split("file://");
    //   this.att_prev = array[1];

    //   console.log(this.att_prev);
    // }, (error:any) => {
    //   this.appCommon.presentToast('Error while storing file.');
    // });
  // }

  // presentToast(msg:any) {
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

  public pathForImage(img:any) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

}
