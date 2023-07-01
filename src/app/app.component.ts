import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NotificationsService } from './services/notifications-service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class AppComponent {
  constructor(
    public pushNotifications: NotificationsService
  ) {
    this.pushNotifications.initPush();
  }
}
