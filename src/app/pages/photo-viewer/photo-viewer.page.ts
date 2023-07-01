import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-photo-viewer',
  templateUrl: './photo-viewer.page.html',
  styleUrls: ['./photo-viewer.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PhotoViewerPage implements OnInit {
  img_src: any;

  constructor(
    private modalController: ModalController,
    public navParams: NavParams
  ) { }

  ngOnInit() {
    this.img_src = this.navParams.data['selectedImage'];
  }

  async closeModal() {   
    await this.modalController.dismiss();
  }
}
