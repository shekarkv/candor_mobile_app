import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, NavParams } from '@ionic/angular';

// @IonicPage()
@Component({
  selector: 'page-previewfile',
  templateUrl: 'previewfile.html',
  styleUrls: ['previewfile.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ]
})
export class PreviewfilePage {
  fileUrl: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.fileUrl = this.navParams.get('fileUrl');
    // browserTab.isAvailable()
    //   .then(isAvailable => {
    //     if (isAvailable) {
    //       browserTab.openUrl('https://ionicframework.com/');
    //     } else {
    //       // open URL with InAppBrowser instead or SafariViewController
    //     }
    //   });
  }
  ngOnInit() {
    // const browser = this.iab.create(this.fileUrl, '_self', { location: 'no' });
    // browser.close();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PreviewfilePage');
  }
}
