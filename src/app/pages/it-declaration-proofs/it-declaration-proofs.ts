import { Component } from '@angular/core';
import { NavController, Platform, ModalController } from '@ionic/angular';
import { AlertController, LoadingController } from '@ionic/angular';
// import { GetService } from '../../app/app.getservice';
import { AppCommon } from '../../app.common';
// import { BrowserTab } from '@ionic-native/browser-tab';
import { HttpserviceService } from '../../services/httpservice.service'; 
import { IonicModule } from '@ionic/angular'; 
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { UploadDocumentPage } from '../upload-document/upload-document';
import { ViewAttachmentPage } from '../view-attachment/view-attachment';


@Component({
  selector: 'page-it-declaration-proofs',
  templateUrl: 'it-declaration-proofs.html',
  styleUrls: ['it-declaration-proofs.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ],
})
export class ItDeclarationProofsPage {

  loginData: any;
  login_client_db: any;
  login_int_code: any;
  yearList: any;
  fin_year: any;
  it_data: any;
  shownGroup = null;
  login_company: any;

  view_image: any;

  loading_msg: any;
  login_type: any;

  constructor(public navCtrl: NavController,  
    // public get: GetService,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController, public appCommon: AppCommon,
    private platform: Platform, 
    // private browserTab: BrowserTab, 
    public modalCtrl: ModalController,
    public http: HttpserviceService
    ) {


    this.loading_msg = 'Loading...';

    this.loginData = JSON.parse(localStorage.getItem('loginData'));
    this.login_client_db = this.loginData['login_client_db'];
    this.login_int_code = this.loginData['login_int_code'];
    this.login_type = this.loginData['login_type'];

    this.getAllFinancialYear();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ItDeclarationProofsPage');
  }

  getAllFinancialYear() {
    this.appCommon.presentLoader('Please Wait...');

    let url = 'appGetAllFinancialYear&login_client_db=' + this.login_client_db;
    this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)
          console.log(data)
          this.yearList = data.data['fin_year_list'];
          this.fin_year = data['data']['cur_fin_year_code'];
          this.appCommon.dismissLoader();
          this.getItDeclarationProofs();

        }, (err) => {
          this.appCommon.presentAlert('Server Problem')
          this.appCommon.dismissLoader();
        }
      )
  }

  getItDeclarationProofs() {

    this.loading_msg = 'Loading...';
    this.view_image = '';
    this.it_data = [];

    this.appCommon.presentLoader('Please Wait...');
    let url = 'appGetItDeclarationProofs&login_client_db=' + this.login_client_db;
    url += '&year=' + this.fin_year + '&login_int_code=' + this.login_int_code;
    this.http.postservice(url, '').subscribe((res:any)=>{
      let data = JSON.parse(res.data)
          this.it_data = data['data'];

          if (this.it_data.length > 0)
            this.loading_msg = 'Loaded'
          else
            this.loading_msg = 'No Records Found';

          console.log(data)
          this.appCommon.dismissLoader();
        }, (err) => {
          this.appCommon.presentAlert('Server Problem')
          this.appCommon.dismissLoader();
        }
      )
  }

  toggleGroup(group) {
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    } else {
      this.shownGroup = group;
    }
  }

  isGroupShown(group) {
    return this.shownGroup === group;
  }

  async uploadProofs(head_int_code, it_head) {
    
    const modal = await this.modalCtrl.create({
      component: UploadDocumentPage,
      componentProps:{ 
        head_int_code: head_int_code, 
        it_head: it_head, 
        login_int_code: this.login_int_code, 
        login_client_db: this.login_client_db, 
        fin_int_code: this.fin_year 
      }
    });
 
    modal.onDidDismiss().then((data) => {
      this.getItDeclarationProofs();
    });

    return await modal.present();
  }

  async viewItAttachments(attachments) {
 

    const modal = await this.modalCtrl.create({
      component: ViewAttachmentPage,
      componentProps:{
        attachments: attachments
      }
    });
    

    modal.onDidDismiss().then((data) => {
      this.getItDeclarationProofs();
    });

    return await modal.present();
  }

}
