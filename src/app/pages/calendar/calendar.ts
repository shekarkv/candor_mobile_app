import { Component } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
// import { GetService } from '../../app/app.getservice';
import { HttpserviceService } from '../../services/httpservice.service'; 
import { AppCommon } from '../../app.common';
import { IonicModule } from '@ionic/angular'; 
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { NavigationExtras } from '@angular/router';

// @IonicPage()
@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
  styleUrls: ['calendar.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,  CommonModule ] 
})
export class CalendarPage {

  loginData: any;
  login_client_db: any;
  login_int_code: any;

  date: any;
  daysInThisMonth: any;
  daysInLastMonth: any;
  daysInNextMonth: any;
  monthNames: string[];
  currentMonth: any;
  currentYear: any;
  currentDate: any;
  leaveInThisMonth: any;
  cur_mon_length: any;
  currentMonthNum: any;
  display_date: string;
  prevFirstDay: Date;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController,
    // public get: GetService, 
    public http: HttpserviceService,
    public appCommon: AppCommon) {

    this.loginData = JSON.parse(localStorage.getItem('loginData'));
    this.login_client_db = this.loginData['login_client_db'];
    this.login_int_code = this.loginData['login_int_code'];

    this.date = new Date();
    this.monthNames = ['January', 'Febraury', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.getDaysOfMonth();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CalendarPage');
  }

  getDaysOfMonth() {

    this.appCommon.presentLoader('Please Wait...')

    let url = 'appGetDaysOfMonth&login_client_db=' + this.login_client_db + '&login_int_code=' + this.login_int_code;
    url += '&date=' + this.date.toISOString();

    this.http.postservice(url,'').subscribe(
      (res:any) => {
        let data = JSON.parse(res.data)

          this.daysInThisMonth = data.data['days'];

          this.cur_mon_length = data.data.length;

          this.appCommon.dismissLoader();
        }, (err) => {
          this.appCommon.presentAlert('Server Problem')
          this.appCommon.dismissLoader();
        }
      )

    this.daysInLastMonth = new Array();
    this.daysInNextMonth = new Array();
    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentMonthNum = this.date.getMonth() + 1;
    this.currentYear = this.date.getFullYear();

    if (this.date.getMonth() === new Date().getMonth()) {
      this.currentDate = new Date().getDate();
    } else {
      this.currentDate = 999;
    }

    var firstDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay();
    var prevNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth(), 0).getDate();

    for (var i = prevNumOfDays - (firstDayThisMonth - 1); i <= prevNumOfDays; i++) {
      this.daysInLastMonth.push(i);
    }

    var lastDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDay();
    var nextNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth() + 2, 0).getDate();

    for (var i = 0; i < (6 - lastDayThisMonth); i++) {
      this.daysInNextMonth.push(i + 1);
    }

    var totalDays = this.daysInLastMonth.length + this.cur_mon_length + this.daysInNextMonth.length;

    if (totalDays < 36) {
      for (var i = (7 - lastDayThisMonth); i < ((7 - lastDayThisMonth) + 7); i++) {
        this.daysInNextMonth.push(i);
      }
    }
  }

  goToLastMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
    this.getDaysOfMonth();
  }

  goToNextMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth() + 2, 0);
    this.getDaysOfMonth();
  }

  viewLeaveBalance() {

    var ytemp = String(this.currentYear);
    var temp = ytemp.concat("-");
    var tmonth = String(this.currentMonthNum);
    if (tmonth.length < 2)
      tmonth = '0' + tmonth;
    var date = temp.concat(tmonth);
    // this.navCtrl.push('LeaveBalancePage', { date: date, from_page: "home" });

    let navigationExtras: NavigationExtras = {
      queryParams: {
        date: date, 
        from_page: "home"
      }
    };

    this.navCtrl.navigateForward('menu/LeaveBalancePage', navigationExtras);
  }
}
