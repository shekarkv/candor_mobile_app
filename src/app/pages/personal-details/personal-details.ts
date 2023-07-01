import { Component } from '@angular/core';
// import { IonicPage } from '@ionic/angular';
import { LoadingController, AlertController, ToastController, Platform, ModalController } from '@ionic/angular';
import { ActionSheetController, NavController } from '@ionic/angular';
// import { GetService } from '../../app/app.getservice';
// import { File } from '@ionic-native/file-transfer/ngx';
// import { FilePath } from '@ionic-native/file-path';
// import { Camera } from '@ionic-native/camera';
// import { Crop } from '@ionic-native/crop';
// import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
// import { Headers } from '@angular/http';
// import { UrlService } from '../../app/app.service'
// import { FileChooser } from '@ionic-native/file-chooser';
import { AppCommon } from '../../app.common';
// import { PhotoViewer } from '@ionic-native/photo-viewer';
// import { IOSFilePicker } from '@ionic-native/file-picker';
// import { Events } from 'ionic-angular';
// import { BrowserTab } from '@ionic-native/browser-tab';
import { HttpserviceService } from '../../services/httpservice.service'; 
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding, FilesystemDirectory } from '@capacitor/filesystem';
import { PhotoViewerPage } from '../photo-viewer/photo-viewer.page';
import { FileOpener } from '@ionic-native/file-opener/ngx';
// const {Filesystem, Storage} = Plugins;
import { IonicModule } from '@ionic/angular'; 
import { FormsModule } from '@angular/forms'; 
import { CommonModule, JsonPipe } from '@angular/common';

declare var cordova: any;
// @IonicPage()
// @Component({
//   selector: 'page-personal-details',
//   templateUrl: 'personal-details.html',
// })

@Component({
  selector: 'app-personal-details',
  templateUrl: 'personal-details.html',
  styleUrls: ['personal-details.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ]
})

export class PersonalDetailsPage {
  url: String | undefined;
  attachmentFiles: any;
  lastImage: any;

  loginData: any;
  login_client_db: any;
  login_int_code: any;
  login_company: any;

  name: any;
  emp_id: any;
  dob: any;
  gender: any;
  mobile_no: any;
  father_name: any;
  spouse_name: any;
  doj: any;
  bank: any;
  bank_acc_no: any;
  pan_no: any;
  pf_no: any;
  pf_uan: any;
  dept: any;
  location: any;
  email: any;
  address: any;
  designation: any;
  emp_info: string;
  login_pic: any;
  employee_image: any;
  emp_list: any;
  email_pattern: string | undefined;
  mobile_pattern: string | undefined;

  constructor(public navCtrl: NavController, 
    // public navParams: NavParams, 
    public appCommon: AppCommon, public http: HttpserviceService,
    // public cropService: Crop,
    // public get: GetService, 
    private fileOpener: FileOpener,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController, 
    // private file: File, 
    public toastCtrl: ToastController,
    // private camera: Camera,\
    // private transfer: FileTransferObject,
      // public filePath: FilePath, public fileChooser: FileChooser,
    public toastCntrl: ToastController, public platform: Platform, public modalController: ModalController,
    // public filePicker: IOSFilePicker, public geturl: UrlService, private browserTab: BrowserTab,
    // private logins: UrlService, public common: AppCommon, private photoViewer: PhotoViewer,
    // private events: Events
    ) {

    this.loginData = JSON.parse(localStorage.getItem('loginData') || '');
    this.login_client_db = this.loginData['login_client_db'];
    this.login_int_code = this.loginData['login_int_code'];
    this.login_pic = this.loginData['login_pic'];

    // this.logins.getUrl().subscribe((val:any) => this.url = val);

    this.emp_info = 'Personal';

    this.getEmployeePersonalDetails();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PersonalDetailsPage');
  }

  getEmployeePersonalDetails() {
    this.appCommon.presentLoader('Please Wait...')

    let url = 'appGetEmployeePersonalDetails&login_client_db=' + this.login_client_db + '&login_int_code=' + this.login_int_code;
    this.http.postservice(url,'').subscribe(
      (res:any) => {
        let data = JSON.parse(res.data)
        this.name = data['data']['name'];
        this.emp_id = data['data']['code'];
        this.dob = data['data']['dob'];
        this.gender = data['data']['gen'];
        this.mobile_no = data['data']['mobile'];
        this.father_name = data['data']['father_name'];
        this.doj = data['data']['doj'];
        this.bank = data['data']['bank'];
        this.bank_acc_no = data['data']['bank_acc_no'];
        this.pan_no = data['data']['pan_no'];
        this.pf_no = data['data']['pf_no'];
        this.pf_uan = data['data']['pf_uan'];
        this.dept = data['data']['department'];
        this.location = data['data']['location'];
        this.email = data['data']['email'];
        this.address = data['data']['permanent_add'];
        this.designation = data['data']['designation'];
        this.employee_image = data['data']['employee_image'];

        localStorage.setItem('employee_login_pic', this.employee_image);
        // this.events.publish('employeeProfileUpdated');

        this.appCommon.dismissLoader();
      }, (err:any) => {
        this.appCommon.presentAlert('Server Problem')
        this.appCommon.dismissLoader();
      }
    )
  }

  async uploadProPic() { 

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

    // this.copyFileToLocalDir(selectedImage.webPath, currentName, this.createFileName()); 
    this.copyFileToLocalDir(selectedImage, currentName,  this.createFileName(), selectedImage.webPath); 

      // if (this.platform.is('android')) {
      //   this.filePath.resolveNativePath(newImage)
      //     .then((filePath:any) => {
      //       let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
      //       let currentName = newImage.substring(newImage.lastIndexOf('/') + 1, newImage.lastIndexOf('?'));
      //       this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      //     });
      // }
      // else {
      //   var currentName = newImage.substr(newImage.lastIndexOf('/') + 1);
      //   var correctPath = newImage.substr(0, newImage.lastIndexOf('/') + 1);
      //   this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      // }

  }

  checkPlatformForWeb() {
    if(Capacitor.getPlatform() == 'web' || Capacitor.getPlatform() == 'ios') return true;
    return false;
  }
 
  // takePicture(a:any) {
  //   let options =
  //   {
  //     quality: 100,
  //     sourceType: a,
  //     saveToPhotoAlbum: false,
  //     correctOrientation: true,
  //     allowEdit: true,
  //   };
  //   this.camera.getPicture(options)
  //     .then((data:any) => {
  //       this.cropService
  //         .crop(data, { quality: 75 })
  //         .then((newImage:any) => {
  //           if (this.platform.is('android')) {
  //             this.filePath.resolveNativePath(newImage)
  //               .then((filePath:any) => {
  //                 let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
  //                 let currentName = newImage.substring(newImage.lastIndexOf('/') + 1, newImage.lastIndexOf('?'));
  //                 this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
  //               });
  //           }
  //           else {
  //             var currentName = newImage.substr(newImage.lastIndexOf('/') + 1);
  //             var correctPath = newImage.substr(0, newImage.lastIndexOf('/') + 1);
  //             this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
  //           }
  //         }, (error:any) => console.error("Error cropping image", error));
  //     }, function (error:any) {
  //       console.log(error);
  //     });
  // }
  private copyFileToLocalDir(namePath:any, currentName:any, newFileName:any, fileData:any) {
    console.log('copyFileToLocalDir');
    console.log('namePath - '+namePath);
    console.log('currentName - '+currentName);
    console.log('Data - '+FilesystemDirectory.Data);
    // Filesystem.copy( 
    //   {
    //     from: namePath,   
    //      to: currentName,
    //      toDirectory: FilesystemDirectory.Data
    //  } 
    //   ).then((success:any) => {
    //   this.attachmentFiles = newFileName;
    //   console.log('copyFileToLocalDir then');
      // this.updateProfilePicture(namePath);
      this.updateProfilePicture(fileData, namePath);
    // }, (error:any) => {
    //   this.presentToast('Error while storing file.');
    //   console.log('copyFileToLocalDir error'+error);
    // });
    // console.log('copyFileToLocalDir after');
  }

  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }
  presentToast(msg:any) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    // toast.present();
  }
  public pathForImage(img:any) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }
  OpenNativeFileDownload(a:any) {
    // if (this.platform.is('android') == false) {
      // this.browserTab.isAvailable()
      //   .then((isAvailable:any) => {
      //     if (isAvailable) {
      //       this.browserTab.openUrl(a);
      //     } else {
      //     }
      //   });
    // }
    // else {
      this.appCommon.OpenNativeFileDownload(a)
    // }
  }

  async openFile(f:any){
    const name = f.substr(f.lastIndexOf('/' + 1))
    const mimeType = this.getMimeType(name);

    this.fileOpener.showOpenWithDialog(f, mimeType)
    .then(() => console.log('File is opened'))
    .catch(e => console.log('Error opening file',e))
  }

  private getMimeType(name:any){
    if(name.indexOf('pdf') >= 0){
      return 'application/pdf';
    } else if(name.indexOf('png') >= 0){
      return 'image/png';
    } else if(name.indexOf('mp4') >= 0){
      return 'video/mp4'
    }
    else
      return ''
  }

  ShowAttachedImage(path:any) {
    // if (this.platform.is('android') == false) {
    //   this.browserTab.isAvailable()
    //     .then((isAvailable:any) => {
    //       if (isAvailable) {
    //         this.browserTab.openUrl(path);
    //       } else {
    //       }
    //     });
    // }
    // else {
    //   this.photoViewer.show(path, '', { share: false });
    // }
    this.appCommon.imageviewer(path);
  }

  async updateProfilePicture(filePath:any, namePath:any) {
    let url =  "appUpdateEmployeeProfilePicNew";
    //File for Upload
    // var targetPath = this.pathForImage(filePath);

    console.log("filePath.. - "+filePath);
    const base64Data = await this.readAsBase64(namePath);
    // File name only
    // var filename = filePath;
    // var header = new Headers();
    // header.append('Content-Type', 'multipart/form-data'); 

    // let options = {
    //   fileKey: 'fileToUpload',
    //   fileName: filename,
    //   chunkedMode: false,
    //   mimeType: 'multipart/form-data',
    //   params: { login_int_code: this.login_int_code, login_client_db: this.login_client_db, company_name: this.login_company }
    // }
    console.log("base64Data - "+base64Data);

    // const response = await fetch(`data:image/jpeg;base64,${base64Data}`);
    const response = await fetch(base64Data);
    const blob = await response.blob();

    // var formData = new FormData();
    // formData.append('fileToUpload',blob, 'profile');
    // formData.append('login_int_code', this.login_int_code);
    // formData.append('login_client_db', this.login_client_db);
    // formData.append('company_name', this.login_company);

    let formData = {
      "fileToUpload": 'profile_pic',
      "attachment": base64Data,
      "file_name": 'profile_pic.jpg',
      'login_int_code': this.login_int_code,
      'login_client_db': this.login_client_db,
      'company_name': this.login_company,
    };

    const headers = { 'content-type': 'multipart/form-data' };    

    // let options = { login_int_code: this.login_int_code, login_client_db: this.login_client_db, company_name: this.login_company, fileToUpload: `data:image/jpeg;base64,${base64Data}`  }
    // console.log("formdata login_int_code - "+formData.get('login_int_code'));
    // console.log("formdata - "+JSON.stringify(formData));
    // this.http.postserviceWithHeader(url, formData, headers).subscribe((res:any)=>{
    this.http.postservice(url, formData).subscribe((res:any)=>{
        console.log(' updateProfilePicture post');
            this.getEmployeePersonalDetails()


      }, (err:any) => {

        this.appCommon.presentAlert('Server Problem')
      }
    )


    // const fileTransfer: FileTransferObject = this.transfer.create();
    // this.transfer.upload(targetPath, encodeURI(url), options)
    //   .then((data:any) => {
    //     console.log(' updateProfilePicture then');
    //     this.getEmployeePersonalDetails()
      // }, (err:any) => {
      //   console.log(JSON.stringify(err));
      // });
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


  async ViewProfilePhoto(path:any) {
    // if (this.platform.is('android') == false) {
    //   this.browserTab.isAvailable()
    //     .then((isAvailable:any) => {
    //       if (isAvailable) {
    //         this.browserTab.openUrl(path);
    //       } else {
    //       }
    //     });
    // }
    // else {
    //   this.photoViewer.show(path, '', { share: true });
    // }
     this.appCommon.imageviewer(path);
  }

}